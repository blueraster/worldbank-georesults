var AppController = function(){
		var that = this;
		this.searchProjects = function (items,request){
					var searchObject = [];
					if (appModel.get("app.currentSearchText")) {
					searchObject["SearchWords"] = "*" + appModel.get("app.currentSearchText") + "*";
					} else
					{
					searchObject["SearchWords"] = "*";
					}
					
						if (appModel.get("app.currentSearchCountry")) {
					searchObject["Country"] = "*" + appModel.get("app.currentSearchCountry") + "*";
					} else
					{
					searchObject["Country"] = "*";
					}
				//console.log(appModel.get("app.currentSearchCountry"));
				//console.dir(searchObject);
				appModel.get("app.projects").projectsStore.fetch({query: searchObject, onComplete: that.filterGrid, queryOptions: {ignoreCase:true}});
				
				//dijit.byId("grid").filter(searchObject);			
			};
			
		this.filterGrid = function(items, request) {
			console.log(items);
			var tempGrid = [];
			//var atLeastOne = false;
			for(var i = 0; i < items.length; i++){
					var item = items[i];
					var id = appModel.get("app.projects").projectsStore.getValue(item,"ID");
					tempGrid[id]= projectsGridModel.getByProjectID(id);
					//atLeastOne = true;
			}
			
			if (items.length>0) { // at least one
			//augment tempGrid to add the get() method
			appModel.get("app.KOModel").noProjectsMsg("");

			tempGrid.get = function() {			
					return this;
				}
			appModel.get("app.projectsController").prepareGridForLayout(tempGrid);
				
			console.log(tempGrid);
			} else {
			appModel.get("app.KOModel").noProjectsMsg(appDefault.get("config").noProjectsMessage);
			}
		};
	
		this.handleZoomToGraphics = function(graphics,level){			
			if (level!=undefined){
			var pt = esri.graphicsExtent(graphics).getCenter();
			appModel.get("app.map").centerAndZoom(pt,level);
			} else {
			appModel.get("app.map").setExtent(esri.graphicsExtent(graphics),true);
			}
			that.clearInfoWindow();
			//that.clearMapGraphics();
			if (appModel.get("app.activitiesGLayerSelect")!=undefined){
			appModel.get("app.activitiesGLayerSelect").clear();}			
			};
			
		this.handleZoomToGraphic = function(graphic,type) {
			console.log(graphic.geometry);
			level = appDefault.get("config").zoomLevel;
			appModel.get("app.map").centerAndZoom(graphic.geometry,level);
			if (type=="activity"){
				if (appModel.get("app.activitiesGLayerSelect")!=undefined){
				appModel.get("app.activitiesGLayerSelect").clear();	
				var gr = new esri.Graphic(graphic.geometry,appModel.get("app.highlightSymbol"));
				appModel.get("app.activitiesGLayerSelect").add(gr);	
				console.log("graphic added");
				}			
			}	
			
		}
		
			this.clearMapGraphics = function(msg){
			appModel.get("app.map").graphics.clear();	
			console.log("graphics cleared by " + msg);			
			};
		
		this.handleNavigation = function(type,menuClicked){
			dijit.byId("stackContainer").selectChild(dijit.byId(type));
			//console.log(dijit.byId("stackContainer"));
			appModel.get("app.KOModel").currentMenu(type);
			
				//if (menuClicked){//zoom 
					switch (type) {
					case "StoriesContainer":
					console.log("Clicked ProjectsContainer");
					that.clearMapGraphics();
					//clear activity display container
					dojo.byId("activityDisplayContainer").innerHTML = "";
					dojo.publish(Events.removeAllHandlers,["activityCarouselEventHandlers"]);
					dojo.publish(Events.removeAllHandlers,["activitiesEventHandlers"]);
					//dojo.publish(Events.removeAllHandlers,["activityPageEventHandlers"]);
						if (menuClicked) {
							appModel.get("app.KOModel").currentTitle(appModel.get("app.KOModel").currentTitleProjects());
							appModel.get("app.KOModel").currentTitleLinks("");		
							
							appModel.get("app.KOModel").currentDescription(appModel.get("app.KOModel").currentDescriptionProjects());							
							dojo.publish(Events.zoomToGraphics,[appModel.get("app.projectsFlayer").graphics,0]);							
							}

						appModel.get("app.projectsFlayer").show();
						if (appModel.get("app.activitiesGLayer")) {
						appModel.get("app.activitiesGLayer").hide();
						}
						appModel.get("app.KOModel").linkRootEnabled(true);
						appModel.get("app.KOModel").linkRootActive(false);
						appModel.get("app.KOModel").linkCountryEnabled(false);
						appModel.get("app.KOModel").linkCountryActive(false);
						appModel.get("app.KOModel").linkStoryEnabled(false);
						appModel.get("app.KOModel").linkStoryActive(false);
						appModel.get("app.KOModel").linkActivityEnabled(false);
						appModel.get("app.KOModel").linkActivityActive(false);
						
						dojo.publish(Events.resizeContent,["stackContainer","height",410]);					
						dojo.publish(Events.shareURLupdate,[appModel.get("app.queryShareURL"),appModel.get("app.currentProjectID"),"none"]);

						
					break;
					case "ActivitiesListContainer":
					that.clearMapGraphics();
					dojo.byId("activityDisplayContainer").innerHTML = "";
					console.log("Clicked ActivitiesListContainer");
					dojo.publish(Events.removeAllHandlers,["activityCarouselEventHandlers"]);
					//dojo.publish(Events.removeAllHandlers,["activitiesEventHandlers"]);	
					//dojo.publish(Events.removeAllHandlers,["activityPageEventHandlers"]);	
					
						if (menuClicked) {
							appModel.get("app.KOModel").currentTitle(appModel.get("app.KOModel").currentTitleActivities());	
							appModel.get("app.KOModel").currentDescription(appModel.get("app.KOModel").currentDescriptionActivities());
							dojo.publish(Events.zoomToGraphics,[appModel.get("app.activitiesGLayer").graphics]);							
							}
						appModel.get("app.projectsFlayer").hide();
						if (appModel.get("app.activitiesGLayer")) {
						appModel.get("app.activitiesGLayer").show();
						}
						appModel.get("app.KOModel").linkRootEnabled(true);
						appModel.get("app.KOModel").linkRootActive(true);
						appModel.get("app.KOModel").linkCountryEnabled(true);
						appModel.get("app.KOModel").linkCountryActive(true);
						appModel.get("app.KOModel").linkStoryEnabled(true);
						appModel.get("app.KOModel").linkStoryActive(false);
						appModel.get("app.KOModel").linkActivityEnabled(false);
						appModel.get("app.KOModel").linkActivityActive(false);
						//All activiies loaded from querystring so show now
						if (appModel.get("app.querystring")==true){
							dojo.style("stackContainer","visibility","visible");
							appModel.set("querystring",false);
						}		
						dojo.publish(Events.resizeContent,["stackContainer","height",370]);
						dojo.publish(Events.shareURLupdate,[appModel.get("app.queryShareURL"),appModel.get("app.currentProjectID"),appModel.get("app.currentActivityID")]);					
						//dojo.style("stackContainer","height","380px");							
					break;
					case "ActivityContainer":
					console.log("Clicked ActivityContainer");
						if (menuClicked) {
							appModel.get("app.KOModel").currentTitle(appModel.get("app.KOModel").currentTitleActivity());	
							appModel.get("app.KOModel").currentDescription(appModel.get("app.KOModel").currentDescriptionActivity());
							dojo.publish(Events.zoomToGraphic,[appModel.get("app.activitiesSelectedGraphic"),"activity"]);							
						}
						appModel.get("app.projectsFlayer").hide();
						if (appModel.get("app.activitiesGLayer")) {
						appModel.get("app.activitiesGLayer").show();
						}
						appModel.get("app.KOModel").linkProjectValue(appModel.get("app.KOModel").currentTitleActivities());
						//appModel.get("app.KOModel").linkActivityValue(appModel.get("app.KOModel").currentTitleActivity());
						appModel.get("app.KOModel").linkRootEnabled(true);
						appModel.get("app.KOModel").linkRootActive(true);
						appModel.get("app.KOModel").linkCountryEnabled(true);
						appModel.get("app.KOModel").linkCountryActive(true);
						appModel.get("app.KOModel").linkStoryEnabled(true);
						appModel.get("app.KOModel").linkStoryActive(true);
						appModel.get("app.KOModel").linkActivityEnabled(true);
						appModel.get("app.KOModel").linkActivityActive(false);
						dojo.publish(Events.resizeContent,["stackContainer","height",370]);					
				
					break;			
					}
					appModel.get("app.KOModel").currentDescriptionMinimized(true);
					appModel.get("app.KOModel").currentDescriptionHeight(parseInt(dojo.style("storyDescription","height")));;							
					
					
					//console.log("Minimized? " + appModel.get("app.KOModel").currentDescriptionMinimized());
					//console.log("Content Height - " + appModel.get("app.KOModel").currentDescriptionHeight());
					
				//}
			
			};
			
		
			
		this.clearInfoWindow = function(graphics){
			appModel.get("app.map").infoWindow.hide();					
			};
			
		this.animateHeight = function(containerID,contentID,expand){
			
			//dojo.removeClass(containerID,className);
			var startH = 0;
			var endH = 0;
			//alert(appModel.get("app.KOModel").currentDescriptionHeight());
			if (expand){
			endH = parseInt(appModel.get("app.KOModel").currentDescriptionHeight());			
			startH = 80;
			appModel.get("app.KOModel").currentDescriptionMinimized(false);
			} else
			{
			endH = 80;
			startH = parseInt(appModel.get("app.KOModel").currentDescriptionHeight());
			appModel.get("app.KOModel").currentDescriptionMinimized(true);
			}
			
			//console.log("Minimized? " + appModel.get("app.KOModel").currentDescriptionMinimized());
			//console.log("Content Height - " + appModel.get("app.KOModel").currentDescriptionHeight());
		
			dojo.animateProperty({
			  node:containerID,
			  duration: 500,
			  properties: {
				  height: { start:startH, end: endH }
			  }
			}).play();
			
			/*dojo.animateProperty({
			  node:contentID,
			  duration: 500,
			  properties: {
				  height: { start:startH, end: endH }
			  }
			}).play();	*/
			
			
			};
			
			this.addHandler = function(handleArray,func){
				//alert(handleArray.length);
				handleArray.push(func);
				//console.dir(handleArray);
			};
			
			this.removeAllHandlers = function(handleArray){	
				//console.log("REMOVED HANDLERS for " + handleArray);	
				//console.dir(appModel.get("app."+handleArray));				
				dojo.forEach(appModel.get("app."+handleArray),function(handle){
					dojo.disconnect(handle);									
				});			
				appModel.set(handleArray,new Array());
				//console.log("handleArray.length " +  appModel.get("app."+handleArray).length);
			};
			
			this.resizeContent = function(divId,dimension,pixels){
				dojo.style(divId,dimension,pixels.toString()+"px");							
				dijit.byId(divId).resize();
				console.log("RESIZED " + divId + " TO " + pixels);
			};
			
			this.shareURLupdate = function(url,project,activity){				
				//appModel.get("app.queryShareURL")
				//alert(activity);
				appModel.set("currentProjectID",project);
				appModel.set("currentActivityID",activity);
				
				var shareURL = url+"#";
				var hashObj = {};

				if (project!="none"){
				shareURL += "project="+project;
				hashObj.project = project;
				}
				
				if (activity!="none"){
				shareURL += "&activity="+activity;
				hashObj.activity = activity;
				}
				updateHashByClick = true;
				dojo.hash(dojo.objectToQuery(hashObj));

				setTimeout(function(){
					updateHashByClick = false;

				},300)
				
				
				parent.location.href = shareURL;
				shareURL = dojox.dtl.filter.strings.urlencode(shareURL);
				//shareURL = shareURL +  "#project=" + project + "&activity=" + activity;
				//alert("shareURL " + shareURL);
				dojo.query(".fb-like").forEach(function(node){
					dojo.attr(node,"data-href",shareURL);
					FB.XFBML.parse();
					
					//node.innerHTML = "<div class='fb-like' data-href='"+shareURL+"' data-send='false'	data-width='30' layout='button_count' data-show-faces='false' data-font='arial'></div>";									
					//dojo.place("<div class='fb-like' data-href='"+shareURL+"' data-send='false'	data-width='30' layout='button_count' data-show-faces='false' data-font='arial'></div>",node,"only");									
				});
				
				dojo.query(".twitter-div").forEach(function(node){	
					//shareURL = "http://www.worldbank.com";
					node.innerHTML = "<iframe allowtransparency='true' frameborder='0' scrolling='no' src='https://platform.twitter.com/widgets/tweet_button.html?url="+shareURL+"&text=World Bank Story Maps' style='width:130px; height:20px;'></iframe>";
				});
			};
			
			this.extentChange = function(extent){
				console.log("minX			minY			maxX			maxY");
				//var minP = esri.geometry.webMercatorToGeographic(new esri.geometry.Point(extent.xmin,extent.ymin, new esri.SpatialReference({ wkid: 102100 })));
				//var maxP = esri.geometry.webMercatorToGeographic(new esri.geometry.Point(extent.xmax,extent.ymax, new esri.SpatialReference({ wkid: 102100 })));
				console.log( dojo.number.round(extent.xmin,2)+"	"+dojo.number.round(extent.ymin,2)+"	"+dojo.number.round(extent.xmax,2)+"	"+dojo.number.round(extent.ymax,2));
				console.log("LEVEL : " + appModel.get("app.map").getLevel());
			}

		
	}
	