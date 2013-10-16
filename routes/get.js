var File = require('./../models/File');

function index(req,res){
	res.render('index',{'title':'Image Uploader'});
}

function upload(req,res){
	res.contentType(req.img.img.contentType);
	res.send(req.img.img.data);
}

function view(req,res){
	res.render('imageview',{'title':'Picture','img':req.img});
}

function recent(req,res){

	File.find({}).limit(10).exec(function(err,docs){
		if(err)throw err;
		for(var i =0; i < docs.length;i++){
			docs[i].img.stringified = docs[i].img.data.toString('base64');
		}

		res.render('recentuploads',{'title':'Recent Uploads','imgs':docs});
	});
}

function recentTag(req,res){
	res.render('recentuploads',{'title':'Recent Tagged '+req.tagname,'imgs':req.imgs});
}


function about(req,res){
	res.render('about',{'title':'About'});
}

function contact(req,res){
	res.render('contact',{'title':'Contact Us'});
}

module.exports = {
	index:index,
	about:about,
	contact:contact,
	upload:upload,
	view:view,
	recent:recent,
	recentTag:recentTag
};