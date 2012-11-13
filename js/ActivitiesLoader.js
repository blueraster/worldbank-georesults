//singleton example
var ActivitiesLoader = (function () {

		function Singleton(options) {
		// set options to the options supplied or an empty object if none provided.
		var that = this;
		
		options = options || {};

		this.activitiesStore;
	
		this.activitiesFlayer;

		this.pid = "";
		
		this.prepareActivityStore = function(ID,type){		
				//console.log(webmapModel.get("activities"));
				//console.log(ID);

				var activities = webmapModel.get("activities")[ID];
				//console.log(activities);
				//var csv = appDefault.get("config").activitiesFolder + ID + ".csv";				

				(function(activities){
				var itemsJSON = [];
				
				dojo.forEach(activities.features,function(activity){
				
				var ProjectID = "P"+activity.attributes.ProjectID;
				that.pid = activity.attributes.ProjectID.toString();
				//console.log(ProjectID);
				var ActivityID = "A"+activity.attributes.ActivityID;				
				var ActivityTitle = activity.attributes.Activity;
				var Description = activity.attributes.Description;
				var Type = activity.attributes.Icon;
				var X_Coord = activity.geometry.x;
				var Y_Coord = activity.geometry.y;
				var Videos = activity.attributes.Videos || "none";

				itemsJSON.push({ProjectID:ProjectID,ActivityID:ActivityID,ActivityTitle:ActivityTitle,Description:Description,Type:Type,X_Coord:X_Coord,Y_Coord:Y_Coord,Videos:Videos});
				});
				
				//that.activitiesStore = new dojox.data.CsvStore({url: csv});
				that.activitiesStore = new dojo.data.ItemFileReadStore({data: {items: itemsJSON}});
			
				that.activitiesStore.fetch({query: {}, onComplete: gotItems });
				})(activities,type);
		}
		
		function gotItems(items, request){
		
		dojo.publish(Events.createActivitiesGraphicsLayer,[items,request]); //Add graphics and create the graphics layer if not present, ActivitiesController

			
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
		
