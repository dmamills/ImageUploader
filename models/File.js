var mongoose = require('mongoose');


var fSchema = {
	img: { data: Buffer, contentType:String},
	name: String,
	urlName: String,
	tags: Array
};

module.exports = mongoose.model('File',fSchema);