var ProjectsController = function(){
		var that = this;
		this.createProjectsGraphicsLayer = function(items, request){

				console.log("ProjectsController > loadProjectsGridModelComplete");
				var i,uniqueCountries=[];
				var countryProjectCount = [];
				var countriesObject = [];
				//console.log(appModel.get("projects").projectsStore);
				var countries = webmapModel.get("countries");
				
				for(i = 0; i < items.length; i++){
				//prepare countryStore
					var item = items[i];			
					var cc = appModel.get("app.projects").projectsStore.getValue(item,"Country");
					var ccISO3 = appModel.get("app.projects").projectsStore.getValue(item,"ISO3");
					
					if (dojo.indexOf(uniqueCountries,ccISO3)<0){
					//prepare the countries Object for the Store
					countriesObject.push({id:cc,name:cc}); 
					uniqueCountries.push(ccISO3);
					countryProjectCount[ccISO3] = 1;
					//console.log(ccISO3);
					} else {
					countryProjectCount[ccISO3] = countryProjectCount[ccISO3] + 1;
					}
				}
				
				appModel.set("projectsFlayer",createGraphicsLayer({
													id:"countries"													
													}));
													
				var font = new esri.symbol.Font(appDefault.get("config").textSymbolSize,esri.symbol.Font.STYLE_NORMAL,esri.symbol.Font.VARIANT_NORMAL,esri.symbol.Font.WEIGHT_BOLD,"Arial");
				
				dojo.forEach(countries.features,function(country){
					var ISO3 = country.attributes.ISO3;
					var Country = country.attributes.CNTRY_NAME;
					//console.log(Country);
					var X = country.geometry.x;
					var Y = country.geometry.y;
					if (dojo.indexOf(uniqueCountries,ISO3)>-1) {
						//create graphic
						//add symbol
						
						var symbol = createSymbol({type:"point",size:countryProjectCount[ISO3],
												   borderColor: appDefault.get("config").projectBorderColor,
												   borderWidth: appDefault.get("config").projectBorderWidth,
												   fillColor: appDefault.get("config").projectFillColor
													});
													
						var textSymbol = new esri.symbol.TextSymbol(countryProjectCount[ISO3],font).setColor(new dojo.Color(appDefault.get("config").textSymbolColor)).setOffset(appDefault.get("config").textOffsetX,appDefault.get("config").textOffsetY);
						
            
						//console.log(symbol);
						var geom = new esri.geometry.Point(X,Y,new esri.SpatialReference({wkid:102100}));
											
						
						var attrib = [];
						attrib.ProjectCount = countryProjectCount[ISO3];
						attrib.Country = Country;
						var infoTemplate = new esri.InfoTemplate();
							//infoTemplate.setTitle("dsafsf ");
							infoTemplate.setContent("${Country}");
						var graphic = new esri.Graphic(geom,symbol,attrib,infoTemplate);
						var graphicT = new esri.Graphic(geom,textSymbol,attrib,infoTemplate);
						projectModel.add(ISO3,graphic);
						countryProjectCount[ISO3];
						
						

						
						appModel.get("app.projectsFlayer").add(graphic);
						appModel.get("app.projectsFlayer").add(graphicT);
					}					
			
				});
				
				appModel.get("app.map").addLayer(appModel.get("app.projectsFlayer"));				
				dojo.publish(Events.zoomToGraphics,[appModel.get("app.projectsFlayer").graphics,0]);
				dojo.connect(appModel.get("app.projectsFlayer"), eventType.onMouseOver, dojo.hitch(this,"hoverOverProjectGraphic") );
				if (eventType.name=="desktop"){
				dojo.connect(appModel.get("app.projectsFlayer"), eventType.onMouseOut, dojo.hitch(this,"hoverOutProjectGraphic") );
				}
				dojo.connect(appModel.get("app.projectsFlayer"), eventType.onClick, dojo.hitch(this,"hoverClickProjectGraphic") );
				
				
				//console.log("countriesDijit");
				//make the countries Store
				appModel.set("projects.countriesStore",new dojo.data.ItemFileReadStore({data: {identifier:'id',label:'name',items: countriesObject}}));
				console.log("added projects");
					var countriesDijit = new dijit.form.FilteringSelect({
					id:"countriesFilteringSelect",
					name: "countriesFilteringSelect",
					placeHolder: "Filter by Country",
					store: appModel.get("app.projects.countriesStore"),
					searchAttr: "name",
					required: false,
					onChange:function(id) {
						//appModel.get("app.projectsController").filterCountry(id);
						appModel.set("currentSearchCountry",id);
						appModel.get("app.KOModel").currentCountry(appModel.get("app.currentSearchCountry"));	
						dojo.publish(Events.searchText,[]);						
					}
				}, "countriesFilteringSelect");
				countriesDijit.startup();
				console.log("countriesDijit started");
				
			
				
			}
			
		this.loadProjectsGridModel = function (items) {
			//STEP 2 
			//var node=dojo.byId("projectsGrid");
			//dojo.place("","projectsGrid","only");
		

			for(var i = 0; i < items.length; i++){
				//prepare countryStore		
						
					var item = items[i];
									
					var country = appModel.get("app.projects").projectsStore.getValue(item,"Country");
					var description = appModel.get("app.projects").projectsStore.getValue(item,"Description");
					var project = appModel.get("app.projects").projectsStore.getValue(item,"Project");					
					var projecturl = appModel.get("app.projects").projectsStore.getValue(item,"ProjectURL");
					var projectlinksurl = appModel.get("app.projects").projectsStore.getValue(item,"ProjectLinksURL");
					var projectlinkstext = appModel.get("app.projects").projectsStore.getValue(item,"ProjectLinksText");
					var id = appModel.get("app.projects").projectsStore.getValue(item,"ID");
					var iso3 = appModel.get("app.projects").projectsStore.getValue(item,"ISO3");
					var zoomlevel = appModel.get("app.projects").projectsStore.getValue(item,"ZoomLevel");
					var xmin = parseInt(appModel.get("app.projects").projectsStore.getValue(item,"Xmin"));
					var ymin = parseInt(appModel.get("app.projects").projectsStore.getValue(item,"Ymin"));
					var xmax = parseInt(appModel.get("app.projects").projectsStore.getValue(item,"Xmax"));
					var ymax = parseInt(appModel.get("app.projects").projectsStore.getValue(item,"Ymax"));

					//console.log(projectlinksurl);	
					//gridModel.set(id,country,project,description,iso3,zoomlevel,xmin,ymin,xmax,ymax);
					projectsGridModel.set(id,country,project,projecturl,projectlinkstext,projectlinksurl,description,iso3,zoomlevel,xmin,ymin,xmax,ymax);
					
				}		


			
			}
			
		this.setProjectDefaultImages = function (response, io){
			//console.log(response);


			dojo.forEach(response,function(item){
			
				var tags = item.machine_tags.split(" ");				
				var id;

				if (item.machine_tags.indexOf("wb:defaultproject=1")>-1) {
					dojo.forEach(tags,function(tag){
						if (tag.indexOf("wb:project=")>-1) {
						id="P"+tag.split("=")[1];

						projectsGridModel.saveDefaultImage(id,item.url_sq);
						}
					});
				}			
				
			});
		
		//console.log(gridModel);
		
		

		appModel.get("app.projectsController").prepareGridForLayout(projectsGridModel); //ProjectsController
		
		//dojo.place("<div class='projectItem' id='project"+id+"'><b>"+country+"</b><br>"+project+"</div>","projectsGrid");
		//dojo.connect(dojo.byId("project"+id),"onclick",dojo.hitch(appModel.get("app.projectsController"),"projectClickHandler",id,project,description));
		
		}
		
		this.prepareGridForLayout =function(model) {
		//console.log(model.get());
		

		
		var gmodel = model.get();
		var gmodelArray = [];
		
		
		
		var counter=0;
		//dojo.place("","projectsGrid","only");
		for (id in gmodel) {
			if (id!="get") {
				counter++;
				var item = gmodel[id];
				gmodelArray.push(item);
				//console.log(counter);
				//if (counter>9) {break}
				}
		}
		
		appModel.get("app.KOModel").projectGridTotal(counter);	
		appModel.get("app.KOModel").projectGridPages(Math.ceil(counter/9));	
		
		appModel.set("projectsGridModel",gmodelArray);
		//console.log(counter);
		
		
	
		appModel.get("app.projectsController").layoutGrid(0);	
		var gModel = appModel.get("app.projectsGridModel");

			for (var i=0;i<counter;i++){
				var item = gModel[i];
				//console.log(item.id.toUpperCase());
				if (appModel.get("app.queryProjectID")!=undefined && appModel.get("app.queryProjectID").toUpperCase()==item.id.toUpperCase()){
					//console.log(appModel.get("app.querystring"));
					appModel.set("queryProjectID",undefined);
					appModel.set("querystring",true);
					
					dojo.hitch(appModel.get("app.projectsController"),"projectClickHandler",item.id.toUpperCase())();					
				//return;
				}
			}
		
		}
		
		this.layoutGrid = function	(startIndex) {
				console.log("projectscontroller >> layoutGrid");
				//console.log(dojo.byId("searchContainer"));
				//first disconnect all current click handlers				
				dojo.publish(Events.removeAllHandlers,["projectsEventHandlers"]);
				
				appModel.get("app.KOModel").projectGridCurrent(Math.ceil((startIndex+2)/9));	
				
				
				var gModel = appModel.get("app.projectsGridModel");
				//console.dir(gModel);
				var upperLimit = startIndex + 9;
				//console.log("startIndex " + startIndex);
				//console.log("upperLimit " + upperLimit);

				if (gModel.length<upperLimit){upperLimit=gModel.length};
				
				if (dojo.byId("projectsGrid")!=undefined){
				dojo.byId("projectsGrid").innerHTML = "";
				}
				
				appModel.set("querystring",false);
				
				for (var i=startIndex;i<upperLimit;i++){
				
				var item = gModel[i];
				//console.log(item.project);
				//console.log("item.image " + item.image);
				var image = item.image || "images/noImage.jpg";
				
				dojo.place("<div class='gridItem' id='project"+item.id+"'><img class='activitiesImage' src='"+image+"'/><div><div class='gridText'><strong>"+item.country+"</strong><br>"+item.project+"</div>","projectsGrid");
				
				var projectClickHandle = dojo.connect(dojo.byId("project"+item.id),eventType.onclick,dojo.hitch(appModel.get("app.projectsController"),"projectClickHandler",item.id));
				dojo.publish(Events.addHandler,[appModel.get("app.projectsEventHandlers"),projectClickHandle]);
				
				var projectOverHandle = dojo.connect(dojo.byId("project"+item.id),eventType.onmouseover,dojo.hitch(appModel.get("app.projectsController"),"projectMouseOverHandler",item.iso3));
				dojo.publish(Events.addHandler,[appModel.get("app.projectsEventHandlers"),projectOverHandle]);
				
				if (eventType.name=="desktop"){
				var projectOutHandle = dojo.connect(dojo.byId("project"+item.id),eventType.onmouseout,dojo.hitch(appModel.get("app.projectsController"),"projectMouseOutHandler",item.iso3));
				dojo.publish(Events.addHandler,[appModel.get("app.projectsEventHandlers"),projectOutHandle]);
				}
				

				

				
				

				
				}
				
				
				
				dojo.query(".gridText").forEach(function(node){
				if (dojo.style(node,"height")>85){
					var text = node.innerHTML;
					node.innerHTML = text.substring(0,60) + "...";
				}
				
				});
				
				//attach any handlers to nav buttons
				var currentPage = appModel.get("app.KOModel").projectGridCurrent();
				var totalPages = appModel.get("app.KOModel").projectGridPages();

				//console.log("currentPage " + currentPage);
				//console.log("totalPages " + totalPages);
				if (currentPage > 1) {
				//dojo.disconnect(appModel.get("app.prevProjectGridClickHandler"));
				var prevClickHandle = dojo.connect(dojo.byId("prevProjectGrid"),eventType.onclick,dojo.hitch(that,"layoutGrid",startIndex-9));
				dojo.publish(Events.addHandler,[appModel.get("app.projectsEventHandlers"),prevClickHandle]);
				}
				
				if (currentPage < totalPages) {
				//dojo.disconnect(appModel.get("app.nextProjectGridClickHandler"));
				var nextClickHandle = dojo.connect(dojo.byId("nextProjectGrid"),eventType.onclick,dojo.hitch(that,"layoutGrid",startIndex+9));
				dojo.publish(Events.addHandler,[appModel.get("app.projectsEventHandlers"),nextClickHandle]);
				}
				if (appModel.get("app.querystring")==false){
				dojo.style("stackContainer","visibility","visible");
				}

		}

			
		this.projectClickHandler = function(id){		
			//var dataItems = dijit.byId("grid").selection.getSelected();
			//appModel.set("currentSearchCountry",id);
			
			var project = projectsGridModel.getByProjectID(id);
			//console.log(project);
			//alert(id);
			
			if ((project.xmin+project.ymin+project.xmax+project.ymax)!=0){				
				var extent = new esri.geometry.Extent(project.xmin,project.ymin,project.xmax,project.ymax, new esri.SpatialReference({ wkid:102100 }));
				appModel.set("projectExtent",extent);
				console.log(extent);
				//appModel.get("app.map").zoomToExtent(extent)
			}


			
			
			appModel.get("app.KOModel").currentCountry(project.country);	
			//dojo.publish(Events.searchText,[]);	
			
			var clickedProjectID, clickedProject, clickedDescription, clickedProjectLinksURL, clickedProjectLinksText = "";
			projectID = id.substring(1);
			//alert("ProjectsController " + projectID);
			console.log("---->shared from projectClickHandler");	
			dojo.publish(Events.shareURLupdate,[appModel.get("app.queryShareURL"),projectID,"none"]);

			//for(i = 0; i < dataItems.length; i++){		
			//var item = dataItems[i];			
			clickedProjectID = id;//appModel.get("app.projects").projectsStore.getValue(item,"ID");
			clickedProject = project.project;//appModel.get("app.projects").projectsStore.getValue(item,"Project");
			clickedDescription = project.description;//appModel.get("app.projects").projectsStore.getValue(item,"Description");
			clickedProjectURL = project.projecturl;
			clickedProjectLinksURL = project.projectlinksurl;
			clickedProjectLinksText = project.projectlinkstext;
			var clickedProjectLinksTextArray = [];
			var clickedProjectLinksURLArray = [];
			//}
			if ((clickedProjectLinksText.split("||")[0]!="none") && (clickedProjectLinksURL.split("||")[0]!="none")){
				clickedProjectLinksTextArray = clickedProjectLinksText.split("||");
				clickedProjectLinksURLArray = clickedProjectLinksURL.split("||");
			}

						//}
			var title = "";
			var titleLinksArray = [];
			title=clickedProject;
			if (clickedProjectURL){
				title="<a href='"+clickedProjectURL+"' target='_blank'>"+clickedProject+"</a>";
			}
			if ( (clickedProjectLinksTextArray.length>0) && (clickedProjectLinksTextArray.length==clickedProjectLinksURLArray.length) ) {
				
				for (var i=0;i<clickedProjectLinksTextArray.length;i++){
					titleLinksArray.push("<a href='"+clickedProjectLinksURLArray[i]+"' target='_blank' class='sublink'>"+clickedProjectLinksTextArray[i]+"</a>");	
				}
				
			}
			appModel.get("app.KOModel").currentTitle(title);
			appModel.get("app.KOModel").currentTitleLinks(titleLinksArray.join(" | "));
			
			appModel.get("app.KOModel").clickedTitleProjects(clickedProject);
			
			appModel.get("app.KOModel").currentTitle(clickedProject);
			appModel.get("app.KOModel").clickedTitleProjects(clickedProject);
			
			//appModel.get("app.KOModel").currentTitleProjects(clickedProject);
					
			appModel.get("app.KOModel").currentDescription(clickedDescription);
			appModel.get("app.KOModel").currentDescriptionMinimized(true);
			appModel.get("app.KOModel").currentDescriptionHeight(parseInt(dojo.style("storyDescription","height")));
			
			
			appModel.get("app.KOModel").currentTitleActivities(clickedProject);	
			appModel.get("app.KOModel").currentDescriptionActivities(clickedDescription);	
			
			//console.log("Minimized? " + appModel.get("app.KOModel").currentDescriptionMinimized());
			//console.log("Content Height - " + appModel.get("app.KOModel").currentDescriptionHeight());
			
			//Initialize Activities
			

			//alert(clickedProjectID);
			//Load Activities
			appModel.get("app.activitiesLoader").prepareActivityStore(clickedProjectID);//LOAD ACTIVITY CLICKED

		}
		
		this.projectMouseOverHandler = function(ISO3){
			//console.log(ISO3);
			//var dataItem = dijit.byId("grid").getItem(e.rowIndex);
			//overISO3 = appModel.get("app.projects").projectsStore.getValue(dataItem,"ISO3");
			var graphic = projectModel.get(ISO3);

			dojo.hitch(null,appModel.get("app.projectsController").hoverOverProjectGraphic,graphic)();
		}
		
		this.projectMouseOutHandler = function(ISO3){		
			//console.log(ISO3);		
			//var dataItem = dijit.byId("grid").getItem(e.rowIndex);
			//overISO3 = appModel.get("app.projects").projectsStore.getValue(dataItem,"ISO3");
			var graphic = projectModel.get(ISO3);
			dojo.hitch(null,appModel.get("app.projectsController").hoverOutProjectGraphic,graphic)();		
		}
			
			
			this.hoverOverProjectGraphic =  function(evt){
			
						var graphic = evt.graphic || evt;
						//graphic.getDojoShape().moveToFront();
						/*if (graphic.getDojoShape()){
							graphic.getDojoShape().moveToFront();
							appModel.get("app.map").centerAt(appModel.get("app.map").extent.getCenter());
						}*/
						var screenPoint = appModel.get("app.map").toScreen(graphic.geometry);
						//console.log(screenPoint);
						dojo.publish(Events.clearMapGraphics,["projectsController hoverOverProjectGraphic"]);   //use the maps graphics layer as the highlight layer
						dojo.publish(Events.clearInfoWindow,[]);
						var content = graphic.getContent();
						appModel.get("app.map").infoWindow.setContent(content);
						var title = graphic.getTitle();
						appModel.get("app.map").infoWindow.setTitle(title);
						//var highlightGraphic = new esri.Graphic(evt.graphic.geometry,highlightSymbol);
						//map.graphics.add(highlightGraphic);
						appModel.get("app.map").infoWindow.show(screenPoint,appModel.get("app.map").getInfoWindowAnchor(screenPoint));
			}
			
			this.hoverOutProjectGraphic =  function(evt){
						dojo.publish(Events.clearMapGraphics,["projectsController hoverOutProjectGraphic"]);   //use the maps graphics layer as the highlight layer
						dojo.publish(Events.clearInfoWindow,[]);
			}
			
			this.hoverClickProjectGraphic = function(evt){
				dojo.byId("map").scrollIntoView();
				var graphic = evt.graphic;
				appModel.set("currentSearchCountry",graphic.attributes.Country);
				//dojo.publish(Events.zoomToGraphic,[graphic,"project"]);
				//dojo.publish(Events.searchText,[]);
				console.log(dijit.byId("countriesFilteringSelect"));
				dijit.byId("countriesFilteringSelect").set("value", graphic.attributes.Country);
				
				//appModel.get("app.projectsController").filterCountry(graphic.attributes.ISO3);
			}
			
			
		this.filterCountry = function(id){		
						//appModel.get("app.projectsFlayer").setDefinitionExpression("NAME='" + id + "'");
						var fLayerUpdateHandler = dojo.connect(appModel.get("app.projectsFlayer"),"onUpdateEnd",function(){
							var zoomToCountry = dojo.hitch(appModel.get("app.projectsController"),"zoomAll");
							zoomToCountry();	
							dojo.disconnect(fLayerUpdateHandler);
						});			
		};
		
	}