var appModel = (function () {
	
	// private attribute object
	var app = [];
		
	// private methods
	var privateMethod =	function () {
		return "This is a private method";
		};
	return {	
	/*// public attributes
	publicVar: 10,
	
	// public methods
	publicMethod:
	function () {
	return "This is a public method";
	},*/	
	// access the private members
	get:function (name) {		
		return eval(name);	
		},   
	set:function (name,value) {	
	dojo.setObject(name,value,app);
	}
	}
})(); // the parens here cause the anonymous function to execute and return
//appModel.set("myname.name","aamir suleman");
//console.log(appModel.get("app.myname.name"));
//console.log(appModel.get("mapURL"));
