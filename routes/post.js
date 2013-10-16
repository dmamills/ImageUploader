var fs = require('fs'),
	File = require('./../models/File');

function upload(req,res){
	
	var imgfile = req.files.img;
	var tags = req.body.imgtags.split(',');
	
	if(imgfile.type == 'image/png' || imgfile.type =='image/jpeg' || imgfile.type == 'image/jpg') {

		var file = new File();

		//sync because i don't understand nodejs yet...
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

function search(req,res){
	var searchTag = req.body.searchtags
	res.redirect('/recent/'+searchTag);
}

module.exports = {
	upload:upload,
	search:search
}