var fs = require('fs');

function init() {

		fs.exists(__dirname+'/public/uploads', function (exists) {
		console.log(exists ?'folder there':'making folder');
	  if(!exists){
	  	fs.mkdir(__dirname+'/public/uploads',function(err){
			if(err)throw err;
		});
	  }
	});

}

module.exports = init;