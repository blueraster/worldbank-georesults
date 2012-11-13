var WebmapController = function(){
			var that = this;
			
			this.countries = [];
			this.projects = [];
			this.activities = [];
			
			this.loadedWebmap = function (data){
						console.log("WebmapController >> loadedWebmap");
						//console.log(data);
						dojo.forEach(data.operationalLayers,function(layer){
						
							if (layer.title=="CountryPointsForArcGIS") {
								that.countries = layer.featureCollection.layers[0].featureSet;								
							}
							if (layer.title=="projects") {
								that.projects = layer.featureCollection.layers[0].featureSet;
							}
							if (layer.title.indexOf("activity_")>-1) {
								var projectID = "";
								projectID = "P"+layer.title.split("_")[1].toString();
								//console.log(projectID);
								that.activities[projectID] = [];
								that.activities[projectID] = layer.featureCollection.layers[0].featureSet;
							}							
						});
						
						that.saveData(that.countries,that.projects,that.activities);					
			
			};
			
			this.saveData = function(countries,projects,activities){
					//console.log(projects);
					console.log("WebmapController >> saveData");
					webmapModel.set(countries,projects,activities);
					//console.log(webmapModel.get("activities")["123"]);
					
					appModel.set("projects",ProjectsLoader.getInstance({
								projects: webmapModel.get("projects")
								}));
					appModel.get("app.projects").loadProjects();
					

			};
			

		
	}