//singleton example
var WebmapLoader = (function () {
		console.log("WebmapLoader");		
		function Singleton(options) {
		// set options to the options supplied or an empty object if none provided.
		var that = this;
		
		options = options || {};

		this.url = options.webmapURL + options.webmap + "/data?f=json";
		
		this.loadWebmapData = function(){	
			console.log("loadWebmapData");		
				(function(url){
					dojo.io.script.get({
					  url : url,
					  callbackParamName : "callback",
					  load: function(data){
						dojo.publish(Events.loadedWebmap,[data]);					
					  }
					});
				})(that.url);
			
		}
		
		
		
				
		}
		
		// this is our instance holder
		var instance;
		
		// this is an emulation of static variables and methods		
		var _static = {
			name: 'projectsModel',
			// This is a method for getting an instance
			// It returns a singleton instance of a singleton object
			getInstance: function (options) {
			if (instance === undefined) {
			instance = new Singleton(options);
			}
			return instance;
			}
		};
		
		return _static;
		
		})();
		
