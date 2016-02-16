exports.parseUrl = function(url){
	var parts = {};
	var uArr = url.split('?');
	parts.filename = uArr[0];
	if(uArr[1]){
		parts.args = {};
		var args = uArr[1].split('&');
		for(var i = 0; i < args.length; i++){
			var a = args[i].split('=');
			parts.args[a[0]] = a[1];
		}
	}
	return parts;
}