//singleton example
var YoutubeLoader = (function () {

		function Singleton(options) {
		// set options to the options supplied or an empty object if none provided.
		var that = this;
		
		options = options || {};


	
		
		this.loadYoutube = function(ID){		
			console.log("Begin Load Youtube");
				(function(ID){
			// Fetch the images. Note the API key used is not for general usage. It's here to demo the store, ONLY.
			//that.flickrStore.fetch({query:{ extras:"owner_name,date_upload,date_taken,geo,machine_tags", userid: "80983953@N04", tags: ID, tag_mode: "all", apikey: "e16226713f6de9a159f258f34bd5f9d9"}, onBegin: clearOldList, onComplete: gotItems, onError: fetchFailed});
			
		
			
			var projectID = "P"+ID;			
			//console.log(activityModel.get("f."+projectID));			
			//console.log(activityModel.get("f."+projectID+".youtubeLoaded"));
			//console.log(activityModel.get("f."+projectID));
			
				if (!activityModel.get("f."+projectID).youtubeLoaded){	
			console.log("Call Youtube API for PROJECT" +  projectID);					
			var youtubeRequest = "http://gdata.youtube.com/feeds/api/videos?max-results=50&format=6&authors=WorldBank,mappingforresults&q="+ID;			
			console.log(youtubeRequest);
			        var requestHandle = esri.request({
					  url: youtubeRequest,
					  headers: {
            				"Content-Type": "application/json"
        				},
					  callbackParamName: "callback",
					  load: dojo.partial(gotItems,projectID),
					  error: fetchFailed
					}, {
					  useProxy: false
					});
				}//end if
				else
				{
					//alert("IN YOUTUBELOADER");
					console.log("Start Drawing Grid > youtube loader");					
					appModel.get("app.flickrController").restructureActivitiesToArray(projectID);
					//appModel.get("app.flickrController").layoutGrid(0);					
				}
			})(ID);
		}
	

		 // Callback for processing a returned list of items.
		function gotItems(projectID,response, io){
			//console.log(response);
			dojo.publish(Events.loadYoutubeModel,[projectID,response, io]);		

		 }
		 
			 // Callback for if the lookup fails.
		 function fetchFailed(error, request){
		   alert("lookup failed.");
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
		

