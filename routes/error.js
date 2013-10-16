function error(req,res){
	res.render('404',{'title':'Page Not Found'});
}

function badError(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
}

module.exports = {
	error:error,
	badError:badError
};