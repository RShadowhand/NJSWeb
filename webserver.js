var http = require('http');
var fs = require('fs');
var util = require("util");
var url = require("./urlParser.js");
var pager = require("./pager.js");

var server = http.createServer(function(req, res){
	var urlHolder = url.parseUrl(req.url);
	var filename = urlHolder.filename;
	var args = urlHolder.args;
	//console.log(filename);
	if(filename == "/"){filename = "/index.js";}
	if(filename.indexOf('/reload') == 0){
		var module = filename.split('/')[2];
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
	else if(filename.indexOf(".js") > 0){
		if(filename.indexOf("/js/") == -1){
			require.uncache('./www'+filename);
			var toRun = require('./www'+filename);
			toRun.main(req,res,util,args,pager);
		}
		else {
			var page = fs.readFileSync('./www'+filename, 'utf8')
			res.writeHead(200);
			res.end(pager.makePage(page,args));
		}
	}
	else{
		if(filename != "/favicon.ico"){
			var page = fs.readFileSync('./www'+filename, 'utf8')
			res.writeHead(200);
			res.end(pager.makePage(page,args));
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

// Don't fuck with the functions below
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
