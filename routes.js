var fs = require('fs'),
	File = require('./models/File');

function index(req,res){
	res.render('index',{'title':'Image Uploader'});
}


function getImageUpload(req,res){
	res.contentType(req.img.img.contentType);
	res.send(req.img.img.data);
}

function getImageView(req,res){
	res.render('imageview',{'title':'Picture','img':req.img});
}

function getRecent(req,res){

	File.find({}).limit(10).exec(function(err,docs){
		if(err)throw err;
		for(var i =0; i < docs.length;i++){
			docs[i].img.stringified = docs[i].img.data.toString('base64');
		}

		res.render('recentuploads',{'title':'Recent Uploads','imgs':docs});
	});
}

function getRecentTag(req,res){
	res.render('recentuploads',{'title':'Recent Tagged '+req.tagname,'imgs':req.imgs});
}


function getAbout(req,res){
	res.render('about',{'title':'About'});
}

function getContact(req,res){
	res.render('contact',{'title':'Contact Us'});
}

function postUpload(req,res){
	
	var imgfile = req.files.img;
	var tags = req.body.imgtags.split(',');
	
	if(imgfile.type == 'image/png' || imgfile.type =='image/jpeg' || imgfile.type == 'image/jpg') {

		var file = new File();

		file.img.data = fs.readFileSync(imgfile.path);
		file.img.contentType = imgfile.type;
		file.tags = tags;
		file.name = imgfile.name;

		//search for last backslash, substring from there.
		var pathName = imgfile.path.split('/');
		file.urlName = pathName[pathName.length-1];
		file.save(function(err){

			if(err)throw err;
			res.redirect('/imageview/'+file.urlName);

		});	
	} else {
		res.render('nofile',{'title':'No File Selected'});
	}
}

function postSearch(req,res){
	var searchTag = req.body.searchtags
	res.redirect('/recent/'+searchTag);
}


module.exports = {
	index:index,
	getImageUpload:getImageUpload,
	getImageView:getImageView,
	getRecent:getRecent,
	getRecentTag:getRecentTag,
	getAbout:getAbout,
	getContact:getContact,
	postUpload:postUpload,
	postSearch:postSearch

}