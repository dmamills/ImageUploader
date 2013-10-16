var express = require('express');
	db = require('./connectionManager'),
	init = require('./init'),
	routes = require('./routes'),
	params = require('./params');

init();

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

/* error handling middleware */
app.use(routes['error'].error);
app.use(routes['error'].badError);

/* Parameter middleware */
app.param('imgname',params.imageName);
app.param('tag',params.tag);


/* GET routes */
app.get('/',routes['get'].index);
app.get('/uploads/:imgname',routes['get'].upload);
app.get('/imageview/:imgname',routes['get'].view);
app.get('/recent',routes['get'].recent);
app.get('/recent/:tag',routes['get'].recentTag);
app.get('/about',routes['get'].about);
app.get('/contact',routes['get'].contact);

/* POST routes */
app.post('/upload',routes['post'].upload);
app.post('/search',routes['post'].search);

app.listen(3000);