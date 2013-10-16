var mongoose = require('mongoose'),
	connectionString = 'mongodb://localhost:27017';

mongoose.connect(connectionString);
var db = mongoose.connection;

db.on('error',function(err) {
        console.log('error connecting to db');
});

db.once('open',function() {
        console.log('connection established');
});

module.exports = db;