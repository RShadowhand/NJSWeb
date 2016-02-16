exports.makePage = function(page,args,data){
	try{
		var blocks = page.split('<?js').length-1;
		for(var i = 0; i < blocks; i++){
			if(page.indexOf('<?js') > -1){
				var js = page.substring(page.indexOf('<?js') + 4, page.indexOf('?>')).trim();
				page = page.replace('<?js', '').replace('?>','');
				var evaled = decodeURIComponent(eval(js));
				if(eval(js) == undefined){evaled = "";}
				page = page.replace(js, evaled);
			}
		}
	}
	catch (ex) {
		page = "Error while parsing page!\n";
		page += util.inspect(ex);
	}
	return page;
}