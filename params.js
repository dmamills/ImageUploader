var File = require('./models/File');

function imageName(req,res,next,imgname){

	File.findOne({'urlName':imgname},function(err,doc) {
		if(err)throw err;

		doc.img.stringified = doc.img.data.toString('base64');
		req.img = doc;
		next();
	});
};

function tag(req,res,next,tag){

    req.tagname = tag;
    var a = [];
    a.push(tag);
	File.where('tags').in(a).exec(function(err,docs) {

		if(err)throw err;

		//convert each to base64 encoding for display
		for(var i =0; i < docs.length;i++) {
			docs[i].img.stringified = docs[i].img.data.toString('base64');
		}

		req.imgs = docs;
		next();
	});
};

module.exports = {
	imageName:imageName,
	tag:tag
};