var fs = require('fs');
var util = require("util");
var pager = require('../pager.js');
var qs = require("querystring");

exports.main = function(req, res, util, getargs){
	var finalizePage = function(postData){
		res.writeHead(200); // 200 means "OK", 404 means "Not found", 500 means "Not allowed"
		
		var args = {};
		
		var arr = {'name':'test'}; // array for testing purposes
		if(getargs != null){
			args.GET = getargs; // add arguments if there are any from http request (GET or POST)
		}
		if(postData != null){
			args.POST = postData;
		}
		
		var file = fs.readFileSync(__dirname+'/index.html', 'utf8'); // read file
		
		file = pager.makePage(file,args,arr); // parse the page with the given data pack
		
		res.write(file); // send the parsed file as response
		
		res.end(); // finish
	}

	var b = "";
	if(req.method == "POST"){
		req.on("data", function(d){
			b = qs.parse(d.toString());
		});
		req.on("end", function(){
			finalizePage(b);
		});
	}
	else{
		finalizePage();
	}
}
