var mongoose = require('mongoose');


var fileSchema = {
	img: { data: Buffer, contentType:String},
	name: String,
	urlName: String,
	tags: Array
};

module.exports = mongoose.model('File',fileSchema);