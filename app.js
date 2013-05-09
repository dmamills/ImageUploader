var express = require('express');
	stylus = require('stylus'),
	util = require('util'),
	mongoose = require('mongoose'),
	fs = require('fs'),
	mongooseManager = require('./connectionManager');


fs.exists(__dirname+'/public/uploads', function (exists) {
	console.log(exists ?'folder there':'making folder');
  if(!exists){
  	fs.mkdir(__dirname+'/public/uploads',function(err){
		if(err)throw err;
	});
  }
});


mongooseManager.c();
var db = mongoose.connection;


var fSchema = {
	img: { data: Buffer, contentType:String},
	name: String,
	urlName: String,
	tags: Array
};

db.on('error',function(err){
 	console.log('error opening connection');
});

db.once('open',function(){
	console.log('connection opened');
});

var File = mongoose.model('File',fSchema);


var app = express();
app.set('views',__dirname+'/views');
app.set('view engine','jade');
app.configure('development',function(){
	app.locals.pretty = true;
});

app.use(express.bodyParser());
app.use(express.static(__dirname+'/public'));
app.use(app.router);
app.use(express.logger('dev'));
//app.use(stylus);

app.use(function(req,res){
	res.render('404',{'title':'Page Not Found'});
})

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

app.param('imgname',function(req,res,next,imgname){

	File.findOne({'urlName':imgname},function(err,doc){
		if(err)throw err;

		doc.img.stringified = doc.img.data.toString('base64');
		req.img = doc;
		next();
	});
});

app.param('tag',function(req,res,next,tag){

	console.log('recieved param: '+tag);
    req.tagname = tag;
    var a = [];
    a.push(tag);
	File.where('tags').in(a).exec(function(err,docs){
		if(err)throw err;
		console.log('found: '+docs.length);
		for(var i =0; i < docs.length;i++){
			docs[i].img.stringified = docs[i].img.data.toString('base64');
		}

		req.imgs = docs;
		next();
	});
});

app.get('/',function(req,res){
	res.render('index',{'title':'Image Uploader'});
});


app.get('/uploads/:imgname',function(req,res){
	res.contentType(req.img.img.contentType);
	res.send(req.img.img.data);
});


app.post('/upload',function(req,res){
	
	var imgfile = req.files.img;
	var tags = req.body.imgtags.split(',');

	console.log('tags: '+tags);
	console.log(util.inspect(imgfile));	
	
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
});

app.get('/imageview/:imgname',function(req,res){
	res.render('imageview',{'title':'Picture','img':req.img});
});

app.get('/recent',function(req,res){

	File.find({}).limit(10).exec(function(err,docs){
		if(err)throw err;
		for(var i =0; i < docs.length;i++){
			docs[i].img.stringified = docs[i].img.data.toString('base64');
		}

		res.render('recentuploads',{'title':'Recent Uploads','imgs':docs});
	});
});

app.post('/search',function(req,res){
	var searchTag = req.body.searchtags
	res.redirect('/recent/'+searchTag);
});

app.get('/recent/:tag',function(req,res){
	res.render('recentuploads',{'title':'Recent Tagged '+req.tagname,'imgs':req.imgs});

});

app.get('/about',function(req,res){
	res.render('about',{'title':'About'});
});

app.get('/contact',function(req,res){
	res.render('contact',{'title':'Contact Us'});
});

console.log(__dirname);
app.listen(3000);