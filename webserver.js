var http = require('http');
var fs = require('fs');
var util = require("util");
var url = require("./urlParser.js");
var pager = require("./pager.js");

var server = http.createServer(function(req, res){
	var urlHolder = url.parseUrl(req.url);
	var filename = urlHolder.filename;
	var args = urlHolder.args;
	if(filename == "/"){
		if (fileExists("index.njs")) {filename = "/index.njs";}
		else if (fileExists("index.html")) {filename = "/index.html";}
		else { res.writeHead(200); res.end("NJSWeb works!");}
	} 
	// ------------------------------------------------
	// DEBUG URL (RELOADS THE PAGER AND URL PARSER)
	// ------------------------------------------------
	if(filename.indexOf('/reload') == 0){ 
		var module = filename.split('/')[2]; // Gotta tell which module to reload
		require.uncache('./'+module+'.js');
		if(module == "pager"){
			pager = require('./'+module+'.js');
		}
		if(module == "url"){
			url = require('./'+module+'.js');
		}
		res.writeHead(200);
		res.end(module);
	}
	// ------------------------------------------------
	// DEBUG URL END
	// ------------------------------------------------
	else if(filename.indexOf(".njs") > 0){
		if(fileExists(filename)){
			require.uncache('./www'+filename);
			var toRun = require('./www'+filename);
			toRun.main(req,res,util,args,pager);	
		}
		else {
			res.writeHead(404);
			res.end("NO SUCH FILE!");
		}
	}
	else{
		if(filename != "/favicon.ico"){
			if(fileExists(filename)){
				var page = "";
				fs.readFile('./www'+filename, 'utf8', function(e,d){
					if(e){console.log(e);}
					page = util.format(d);
					res.writeHead(200);
					res.end(pager.makePage(page,args));				
				});
			}
			else {
				res.writeHead(404);
				res.end("NO SUCH FILE!");
			}
		}
		else{
			res.writeHead(500);
			res.end();
		}
	}
});


server.listen(8082, function(){ // you can change what port it works on
  console.log('listening on *:8082\n');
});

// ---------------------------------
// DO NOT CHANGE THE FUNCTIONS BELOW
// UNLESS YOU KNOW WHAT YOU'RE DOING
// ---------------------------------
require.uncache = function (moduleName) {
    require.searchCache(moduleName, function (mod) {
        delete require.cache[mod.id];
    });
};

require.searchCache = function (moduleName, callback) {
    var mod = require.resolve(moduleName);
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
        (function run(mod) {
            mod.children.forEach(function (child) {
                run(child);
            });

            callback(mod);
        })(mod);
    }
};

var fileExists = function(file){
	try{
		fs.statSync("./www/"+file);
	}catch(err){
		if(err.code == 'ENOENT') return false;
	}
	return true;
}