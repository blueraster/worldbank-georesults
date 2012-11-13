var ActivitiesController = function(){
		
		this.createActivitiesGraphicsLayer = function (items,request,type){
			var uniquePoints = false;
			var xValue = 0;
			console.log("ActivitiesController > loadedActivities");
			activityModel.clearActivity();
			appModel.get("app.KOModel").activityTotal(items.length);	
			
			if (!appModel.get("app.map").getLayer("activities")) {	
			appModel.set("activitiesGLayer", createGraphicsLayer({id:"activities"}));
							
			}else{
			appModel.get("app.activitiesGLayer").clear();
			}
			if (!appModel.get("app.map").getLayer("activitiesSelected")) {	
			appModel.set("activitiesGLayerSelect", createGraphicsLayer({id:"activitiesSelected"}));
						
			}
			var activitiesStore = appModel.get("app.activitiesLoader").activitiesStore;
			var hasVideos = false;
			var pid = "";
			//alert(items.length);
			for(i = 0; i < items.length; i++){
					var item = items[i];
					//console.log(item);
					//var y = appModel.get("app.activities").activitiesStore.getValue(item,"Lat");
					//var x = appModel.get("app.activities").activitiesStore.getValue(item,"Long");
					
					var activityID = activitiesStore.getValue(item,"ActivityID").toString();
					var projectID = activitiesStore.getValue(item,"ProjectID").toString();
					pid = projectID;
					var activityDescription = activitiesStore.getValue(item,"Description");
					var activityType = activitiesStore.getValue(item,"Type");
					var activityTitle = activitiesStore.getValue(item,"ActivityTitle");
					var activityVideos = activitiesStore.getValue(item,"Videos");
					var x = activitiesStore.getValue(item,"X_Coord");
					var y = activitiesStore.getValue(item,"Y_Coord");
					if (x!=xValue && xValue!=0 && uniquePoints==false){
					uniquePoints=true;}
					xValue = x;
					
					if (activityType == undefined){
						activityType = "default";
					}
					//activityNode = "activitiesGraphic."+activityID;
					//console.log(activityID);
					//console.log(projectID);
					
					
					var geom = new esri.geometry.Point(x, y, new esri.SpatialReference({ wkid: 102100 }));		
					//var geom = esri.geometry.geographicToWebMercator(location);
					
					var attrib = [];
					attrib.activityID = activityID;
					attrib.projectID = projectID;					
					attrib.Description = activityDescription;
					attrib.type = activityType;
					attrib.ActivityTitle = activityTitle;
					attrib.Videos = activityVideos;
					if (attrib.Videos!="none"){
						hasVideos = true;
					}

					//console.log(" activityType " + activityType);
					//console.log(activityDescription);
					var infoTemplate = new esri.InfoTemplate();
							infoTemplate.setContent("${ActivityTitle}");
							//infoTemplate.setContent("<b>${Description}</b>");					
							//infoTemplate.setContent("&nbsp;");					
					
					var symbol = new esri.symbol.PictureMarkerSymbol('images/icons/'+activityType+'.png',22,22);	 
					var graphic = new esri.Graphic(geom,symbol,attrib,infoTemplate);	

					
					//console.log("addGeometry " + activityID);
					var uniqueID = projectID + "." + activityID;
					activityModel.setUniqueIdPosition(uniqueID);
					activityModel.addActivityList(uniqueID);
					//console.log(uniqueID);
					activityModel.set(projectID,activityID,"graphic",graphic);
					activityModel.set(projectID,activityID,"description",activityDescription);
					activityModel.set(projectID,activityID,"title",activityTitle);					

					appModel.get("app.activitiesGLayer").add(graphic);
				}

			if (!appModel.get("app.map").getLayer("activities")) {
				appModel.get("app.map").addLayer(appModel.get("app.activitiesGLayer"));				
				appModel.get("app.map").addLayer(appModel.get("app.activitiesGLayerSelect"));
				console.log(uniquePoints);	

					if (appModel.get("app.projectExtent")!=undefined){
						console.log("zooming to entered extents");
						console.log(appModel.get("app.projectExtent"));
						appModel.get("app.map").setExtent(appModel.get("app.projectExtent"),true);
						appModel.set("projectExtent",undefined);
					} else {
				if (uniquePoints){
				dojo.publish(Events.zoomToGraphics,[appModel.get("app.activitiesGLayer").graphics]);
				} else
				{dojo.publish(Events.zoomToGraphic,[graphic,"activity"]);}
					}
				appModel.get("app.activitiesGLayer").enableMouseEvents();
				dojo.connect(appModel.get("app.activitiesGLayer"), eventType.onMouseOver, dojo.hitch(this,"hoverOverActivity"));
				if (eventType.name=="desktop"){
				dojo.connect(appModel.get("app.activitiesGLayer"), eventType.onMouseOut, dojo.hitch(this,"hoverOutActivity"));
				}
				dojo.connect(appModel.get("app.activitiesGLayer"), eventType.onClick, dojo.hitch(this,"clickActivity"));
				
				
			}

				//CALL YOUTUBE if any video was found
				if  (hasVideos) {
					console.log("Call Youtube API from ActivitiesController");	
					appModel.get("app.youtubeLoader").loadYoutube(pid.substring(1).toUpperCase());//youtube loader			
				} else {	
					console.log("Start Drawing Grid > youtube loader");
					appModel.get("app.flickrController").restructureActivitiesToArray(pid);//Flickr Controller
					/*setTimeout(function(){		//TODO, why is  it not working without setTimeOut?
					appModel.get("app.flickrController").layoutGrid(0);	
					},300);			*/
						
				}

			
			};
			
			this.hoverOverActivity = function(evt) {
			
						var graphic = evt.graphic || evt;
						if (graphic.getDojoShape()){
							graphic.getDojoShape().moveToFront();
						}
						
						var screenPoint = appModel.get("app.map").toScreen(graphic.geometry);
						var activityID = graphic.attributes.activityID;
						var projectID = graphic.attributes.projectID;
						var uniqueIDDiv = projectID+activityID;
						//console.log(uniqueIDDiv);
						dojo.publish(Events.clearMapGraphics,["activitiesController hoverOverActivity"]);  //use the maps graphics layer as the highlight layer
						dojo.publish(Events.clearInfoWindow,[]);
						var content = graphic.getContent();
						appModel.get("app.map").infoWindow.setContent(content);
						var title = graphic.getTitle();
						appModel.get("app.map").infoWindow.setTitle(title);
						//var highlightGraphic = new esri.Graphic(graphic.geometry,appModel.get("app.highlightSymbol"));						
						//appModel.get("app.map").graphics.add(highlightGraphic);
						appModel.get("app.map").infoWindow.show(screenPoint,appModel.get("app.map").getInfoWindowAnchor(screenPoint));
						
						dojo.addClass("activity"+uniqueIDDiv, "highlightItem");
						//dojo.window.scrollIntoView("activity"+uniqueIDDiv);						
						
				}
				
			this.hoverOutActivity = function(evt){	
				//console.log(activityModel.get("f"));
				//dojo.publish(Events.clearMapGraphics,["activitiesController hoverOutActivity"]);  //use the maps graphics layer as the highlight layer
				dojo.publish(Events.clearInfoWindow,[]);
				var graphic = evt.graphic || evt;
				var activityID = graphic.attributes.activityID;	
				var projectID = graphic.attributes.projectID;
				var uniqueIDDiv = projectID+activityID;	
				//var sector = graphic.attributes.type;
				//var symbol = new esri.symbol.PictureMarkerSymbol('images/icons/'+sector +'.png',30,30);
				//graphic.setSymbol(symbol);
				dojo.removeClass("activity"+uniqueIDDiv, "highlightItem");
				}
				
			this.clickActivity = function(evt){	
				dojo.byId("map").scrollIntoView();				
				var graphic = evt.graphic || evt;
				var activityID = graphic.attributes.activityID;	
				var projectID = graphic.attributes.projectID;
				var uniqueID = projectID+"."+activityID;
				appModel.get("app.flickrController").imageClickHandler(uniqueID);				
				}



				
			
		

		
	}