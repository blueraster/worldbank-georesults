//singleton example
var ProjectsLoader = (function () {

		function Singleton(options) {
		// set options to the options supplied or an empty object if none provided.
		var that = this;
		
		options = options || {};

		this.projects = options.projects || "";
		
		this.projectsStore;
		this.countriesStore = [];
		
		this.projectsFlayer;
		
		this.loadProjects = function(){	
		//STEP 1	
				(function(projects){
				//that.projectsStore = new dojox.data.CsvStore({url: csv});
				var itemsJSON = [];
				var count = 0;
				dojo.forEach(projects.features,function(project){
				count++;
				var ID = "P"+project.attributes.ID.toUpperCase();
				var Project = project.attributes.Project;
				var ProjectURL = project.attributes.ProjectURL;
				/*var ProjectSublink = project.attributes.ProjectSublink;
				var SublinkURL = project.attributes.SublinkURL;*/
				var Country = project.attributes.Country;
				var Description = project.attributes.Description;
				var ISO3 = project.attributes.ISO3;
				var ZoomLevel = project.attributes.ZoomLevel || 0;
				var Xmin = parseInt(project.attributes.Xmin) || 0;
				var Ymin = parseInt(project.attributes.Ymin) || 0;
				var Xmax = parseInt(project.attributes.Xmax) || 0;
				var Ymax = parseInt(project.attributes.Ymax) || 0;
				var ProjectLinksText = "none";
				var ProjectLinksTextArray = [];
				var ProjectLinksURL = "none";
				var ProjectLinksURLArray = [];
				for (var i=0;i<10;i++){
					if ((project.attributes["Link"+i+"Text"]!=undefined) && (project.attributes["Link"+i+"URL"]!=undefined)){
						ProjectLinksTextArray.push(project.attributes["Link"+i+"Text"]);
						ProjectLinksURLArray.push(project.attributes["Link"+i+"URL"]);
					}					
				}
				if (ProjectLinksTextArray.length>0){
					ProjectLinksText = ProjectLinksTextArray.join("||");
					ProjectLinksURL = ProjectLinksURLArray.join("||");
				}
				
				var SearchWords = Country + " " + Project + " " + Description + " " + ID.toString();
				//
				itemsJSON.push({ID:ID,Project:Project,ProjectURL:ProjectURL,ProjectLinksText:ProjectLinksText,ProjectLinksURL:ProjectLinksURL,Country:Country,Description:Description,ISO3:ISO3,SearchWords:SearchWords,ZoomLevel:ZoomLevel,Xmin:Xmin,Ymin:Ymin,Xmax:Xmax,Ymax:Ymax});
				});
				
				
				
				
				//that.projectsStore = new dojox.data.CsvStore({url: csv});
				that.projectsStore = new dojo.data.ItemFileReadStore({data: {identifier:'ID',label:'Project',items: itemsJSON}});
				
				
				
				
				
				//dijit.byId("grid").layout.setColumnVisibility(0,false);
				//dijit.byId("grid").setStore(that.projectsStore, {});
				
				//dojo.connect(dijit.byId("grid"),"onRowClick",dojo.hitch(appModel.get("app.projectsController"),"projectClickHandler"));
				//dojo.connect(dijit.byId("grid"),"onMouseOverRow",dojo.hitch(appModel.get("app.projectsController"),"projectMouseOverHandler"));
				//dojo.connect(dijit.byId("grid"),"onMouseOutRow",dojo.hitch(appModel.get("app.projectsController"),"projectMouseOutHandler"));
				
				that.projectsStore.fetch({query: {}, onComplete: gotItems });
				})(that.projects);		
		}
		
		function gotItems(items, request){
				appModel.get("app.projectsController").loadProjectsGridModel(items); //load the projects gridModel from projectsStore, projectsController			

				dojo.forEach(appDefault.get("config").flickrUsers,function(flickrUser){
					appModel.get("app.flickrLoader").callFlickr(flickrUser);//Get Flickr Photos, ProjectsFlickrLoader
				})
				

				dojo.publish(Events.createProjectsGraphicsLayer,[items,request]);//Now Create the projects graphics layer and zoom to it
																				//Also create the FilterSelect, projectsController
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
		
