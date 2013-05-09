exports.c = function(){

//setup mongo db
	mongoose.connect('mongodb://nodejitsu:b33ab4e6b9397deddd0ef97ecb53faf9@alex.mongohq.com:10075/nodejitsudb1434696759',{
		user:'nodejitsu',
		pass:'b33ab4e6b9397deddd0ef97ecb53faf9'
	});
};

