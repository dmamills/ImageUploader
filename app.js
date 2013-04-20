var express = require('express');
	stylus = require('stylus'),
	util = require('util'),
	mongoose = require('mongoose'),
	fs = require('fs');

//setup mongo db
mongoose.connect('mongodb://localhost/imagedb');
var db = mongoose.connection;

var fileSchema = {
	location:String,
	path:String,
	url:String
};

db.on('error',function(err){
 	console.log('error opening connection');
});

db.once('open',function(){
	console.log('connection opened');
});

var File = mongoose.model('File',fileSchema);


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


app.param('imgname',function(req,res,next,imgname){
	File.findOne({'url':imgname},function(err,doc){
		if(err)throw err;
		req.img = doc;
		next();
	});
});

app.get('/',function(req,res){
	res.render('index',{'title':'Image Uploader'});
})

app.post('/upload',function(req,res){
	
	var imgfile = req.files.img;
	console.log(util.inspect(imgfile));	
	
	if(imgfile.type == 'image/png' || imgfile.type =='image/jpeg' || imgfile.type == 'image/jpg') {

		fs.readFile(imgfile.path,function(err,data){
			var filepath = __dirname+'/public/uploads/'+imgfile.path.replace('/tmp/','');
			var filename = imgfile.path.replace('/tmp/','');
			
			switch(imgfile.type) {
				case 'image/png':
					filepath = filepath + '.png';
					filename = filename + '.png';
					break;
				case 'image/jpeg':
					filepath = filepath + '.jpeg';
					filename = filename + '.jpeg';
					break;
				case 'image/jpg':
					filepath = filepath + '.jpg';
					filename = filename + '.jpg';
					break;	
			}
			
			fs.writeFile(filepath,data,function(err){
				if(err)throw err;
	
				var fileUrl = imgfile.path.replace('/tmp/','');
					var newFile = File({'location':filepath,'path':filename,'url':fileUrl});
	
				newFile.save(function(err){
					if(err)throw err;
	
					res.redirect('/imageview/'+fileUrl);
				});	
			});
	
		});
	} else {
		res.render('nofile',{'title':'No File Selected'});
	}
});

app.get('/imageview/:imgname',function(req,res){
	res.render('imageview',{'title':'Picture','imgname':req.img.path});
});

app.get('/about',function(req,res){
	res.render('about',{'title':'About'});
});

app.get('/contact',function(req,res){
	res.render('contact',{'title':'Contact Us'});
});

console.log(__dirname);
app.listen(3000);