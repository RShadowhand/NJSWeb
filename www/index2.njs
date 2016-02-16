exports.main = function(req,res,util) {
	res.writeHead(200);
	res.write("LELELEL");
	res.end(util.inspect(req, false, null));
}