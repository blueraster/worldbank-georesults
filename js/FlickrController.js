var FlickrController = function(){

		var that = this;
				
		this.loadActivityModel = function (photos,user){
			//dijit.byId('activitiesGallery').setDataStore(flickrRestStore, request);
			//dijit.byId('stackContainer').forward();		
			   console.log("loadActivityModel");
				
			   var list = dojo.byId("activitiesGrid");
			   var hasBeforeAfter = false;
			   activityModel.clearBeforeAfterImages();
			   list.innerHTML = "";
			   
			   if (photos.length==0){
			   console.log("Error >>>>> ProjectID not found in Flickr");
			   return;
			   }
			   
			   if(list){
				 var i;
				 var pID = "";
				 for (i = 0; i < photos.length; i++) { //add all activities with photos first
					
				   var item = photos[i];
				   //var user = item.owner;
				   var thumbPic = item.url_t;
				   var largePic = item.url_z;
				   var mediumPic = item.url_m;
				   var mediumH = item.height_m;
				   var mediumW = item.width_m;
				   var squarePic = item.url_sq;
				   var smallPic = item.url_s;
				   
				   var description = item.description._content;
				   
				   var machineTags = item.machine_tags.split(" ");
				   
				   //console.log(machineTags);
				   
				   var isBeforeAfter = false;
				   var isDefault = false;
				   var hasOrder = false;
				   var activityID = "";
				   var projectID="";
				   var position = 0;
				   var order = 0;
				   var place = "before";
				    
				   for (tags in machineTags) {
						
						var tag = machineTags[tags];
						
						if (tag.indexOf("before")>-1) {
						isBeforeAfter = true;
						position = tag.split("=")[1];
						place = "first";
					   }
					   
		   
					   if (tag.indexOf("after")>-1) {
						isBeforeAfter = true;
						position = tag.split("=")[1];
						place = "last";
					   }	

					   if (tag.indexOf("wb:activity")>-1) {
						activityID = "A"+tag.split("=")[1].toString().toUpperCase();
						//console.log("activityID" + activityID);
					   }

						if (tag.indexOf("wb:project")>-1) {
						projectID = "P"+tag.split("=")[1].toString().toUpperCase();
						//console.log("projectID" + projectID);						
					   }
					   
					   if (tag.indexOf("wb:defaultactivity")>-1) {
						isDefault = true;
						//console.log("is default activity");					
					   } 
					   
					   if (tag.indexOf("wb:order")>-1) {
						hasOrder = true;
						order = tag.split("=")[1];						
					   } else {
						order = 0;
					   }
					   
				   }//end for Machinetags
				  
				if (projectID!=""){	
					//alert(projectID);
					var uniqueID = projectID + "." + activityID;					  				  
						if (isBeforeAfter){
						hasBeforeAfter = true;
						//console.log(activityID);
						activityModel.addBeforeAfterImage(item.id,user,projectID,activityID,smallPic,squarePic,mediumPic,mediumH,mediumW,description,position,place,isDefault,order);
						} else {
						activityModel.addImage(item.id,user,projectID,activityID,smallPic,squarePic,mediumPic,mediumH,mediumW,description,isDefault,order);
						}//end if					
					}//end if

				 }//End For Photos				
			   }//end If list

			//console.dir(activityModel.get("f"));
			for (var pid in activityModel.get("f")){
			   	if (activityModel.get("f")[pid].hasBeforeAfter){
			   		activityModel.arrangeBeforeAfter(pid);
			   	}
			}

			
			};
			
		this.restructureActivitiesToArray = function(pid){	
			//alert(pid);
			var model = activityModel.get("f."+pid);
			var counter=0;
			var activitiesInArray = [];
			for (activityID in model) {				
				if (activityID!="flickrLoaded" && activityID!="hasBeforeAfter") {
				console.log("Remove Undefined Items");
				//console.dir(model[activityID]["media"]);
				var tempArray = [];
				dojo.forEach(model[activityID]["media"],function(item){
					//console.log(item);
					if (item != undefined){
					tempArray.push(item);
					}
				});				
				counter++;
				model[activityID]["media"] = tempArray;
				//console.dir(tempArray);
				activitiesInArray[parseInt(activityID.substring(1))-1]=model[activityID];//Activity ID is used to determine position (as in CSV)
				}
			}



			appModel.get("app.KOModel").activityGridTotal(counter);	
			appModel.get("app.KOModel").activityGridPages(Math.ceil(counter/9));	
			appModel.set("activitiesGridModel",activitiesInArray);

			if (appModel.get("app.queryActivityID")!=undefined){
					
					appModel.set("querystring",true);
					console.log(appModel.get("app.querystring"));
					var uniqueID = pid + "." + appModel.get("app.queryActivityID");
					
					appModel.set("queryActivityID",undefined);
					dojo.hitch(appModel.get("app.flickrController"),"imageClickHandler",uniqueID)();	
					appModel.get("app.flickrController").activityNavClickAttach();				
				//return;
			}	else {

				appModel.get("app.flickrController").layoutGrid(0);					
			}


		
		}
			
		this.layoutGrid = function	(startIndex) {
				
				//dojo.publish(Events.removeAllHandlers,["activitiesEventHandlers"]);
				
				var list = dojo.byId("activitiesGrid");
				list.innerHTML = "";
				
				appModel.get("app.KOModel").activityGridCurrent(Math.ceil((startIndex+2)/9));	
				
				
				var gModel = appModel.get("app.activitiesGridModel");
				//console.dir(gModel);
				
				var upperLimit = startIndex + 9;
				//console.log("startIndex " + startIndex);
				//console.log("upperLimit " + upperLimit);
				if (gModel.length<upperLimit){upperLimit=gModel.length};
				
				

				fireEvent('navigation',['ActivitiesListContainer']);
				

				
				for (var i=startIndex;i<upperLimit;i++){
				var item = gModel[i];
				//console.log(i);
				//console.log(item);
				appModel.get("app.flickrController").loadFlickrUI(item);				
				}
				
				//attach any handlers to nav buttons
				var currentPage = appModel.get("app.KOModel").activityGridCurrent();
				var totalPages = appModel.get("app.KOModel").activityGridPages();

				//console.log("currentPage " + currentPage);
				//console.log("totalPages " + totalPages);
				if (currentPage > 1) {
				//dojo.disconnect(appModel.get("app.prevActivityGridClickHandler"));
				var prevClickHandle = dojo.connect(dojo.byId("prevActivityGrid"),eventType.onclick,dojo.hitch(that,"layoutGrid",startIndex-9));
				dojo.publish(Events.addHandler,[appModel.get("app.activitiesEventHandlers"),prevClickHandle]);
				}
				
				if (currentPage < totalPages) {
				//dojo.disconnect(appModel.get("app.nextActivityGridClickHandler"));
				var nextClickHandle = dojo.connect(dojo.byId("nextActivityGrid"),eventType.onclick,dojo.hitch(that,"layoutGrid",startIndex+9));
				dojo.publish(Events.addHandler,[appModel.get("app.activitiesEventHandlers"),nextClickHandle]);
				}
				

				
		}
			
		this.loadFlickrUI = function(activity){
			console.log("loadFlickrUI");
			//console.dir(activity);
			
			var list = dojo.byId("activitiesGrid");				
			if (activity["graphic"]){
				var activityID = activity["graphic"].attributes.activityID;
				var projectID = activity["graphic"].attributes.projectID;
				var squarePic = "images/noImage.jpg";
				var type = activity["graphic"].attributes.type || "default";
				var hasDefaultPic = dojo.some(activity.media,function(mediaItem){
				if (mediaItem!=undefined){
					if (mediaItem.length && mediaItem.length==2){		
						if (mediaItem[0].isDefault) {
						squarePic = mediaItem[0].image;
						that.placeDefaultActivity(squarePic,projectID,activityID,type);
						return true;
						}
						if (mediaItem[1].isDefault) {
						squarePic = mediaItem[1].image;
						that.placeDefaultActivity(squarePic,projectID,activityID,type);
						return true;
						}					
					}
					 else {
					if (mediaItem.type == "video") {
						if (mediaItem.isDefault) {
						squarePic = mediaItem.image;
						that.placeDefaultActivity(squarePic,projectID,activityID,type);
						return true;
						}
					}
					
					if (mediaItem.type == "imagesingle") {
					//console.log(mediaItem.isDefault);
						if (mediaItem.isDefault) {
						squarePic = mediaItem.image;
						that.placeDefaultActivity(squarePic,projectID,activityID,type);
						return true;
						}						
					}
					}
					
					}//mediaItem!=undefined
					//apply default picture

				});
				
				if (!hasDefaultPic){
					for (var item in activity["title"]) {																					
					var squarePic = "images/noImage.jpg";
					var description = activity["description"];	
					that.placeDefaultActivity(squarePic,projectID,activityID);
					return true;
					}
				}
				
				}//end If
				};
				
					
				

				
			
			
			
			this.placeDefaultActivity = function(squarePic,projectID,activityID,type){
					

					var uniqueID = projectID + "." + activityID;
					var uniqueIDDiv = projectID + activityID;
					var type1 = type || "default";
					var icon = type1+".png";
					
					type1 = type1.charAt(0).toUpperCase() + type1.slice(1).toLowerCase();//uppercase first letter

					dojo.place("<div class='gridItem' id='activity"+uniqueIDDiv+"'><img class='activitiesImage' align='left' src='"+squarePic+"' /><img src='images/icons_shadowless/"+icon+"' title='"+type1+"' style='position:absolute;bottom:0px;right:0px;'/><span class='gridText'>"+activityModel.get("f."+uniqueID).title+"</span></div>","activitiesGrid");
					var mouseoverHandle = dojo.connect(dojo.byId("activity"+uniqueIDDiv),eventType.onmouseover,dojo.hitch(that,"imageMouseOverHandler",uniqueID));						
					dojo.publish(Events.addHandler,[appModel.get("app.activitiesEventHandlers"),mouseoverHandle]);
					
					if (eventType.name=="desktop"){
					var mouseoutHandle = dojo.connect(dojo.byId("activity"+uniqueIDDiv),eventType.onmouseout,dojo.hitch(that,"imageMouseOutHandler",uniqueID));
					dojo.publish(Events.addHandler,[appModel.get("app.activitiesEventHandlers"),mouseoutHandle]);
					}
					var onclickHandle = dojo.connect(dojo.byId("activity"+uniqueIDDiv),eventType.onclick,dojo.hitch(that,"imageClickHandler",uniqueID));
					dojo.publish(Events.addHandler,[appModel.get("app.activitiesEventHandlers"),onclickHandle]);
					
					//alert("CLICKED ACTIVITY " + uniqueID);
					var pos = parseInt(activityModel.getUniqueIdPosition(uniqueID));
					appModel.get("app.flickrController").activityNavClickAttach();
					



					
					}
			
			this.imageMouseOverHandler = function(uniqueID){
					//console.log(uniqueID);
					var graphic = activityModel.get("f."+uniqueID).graphic;
					dojo.hitch(null,appModel.get("app.activitiesController").hoverOverActivity,graphic)();					
			}
			this.imageMouseOutHandler = function(uniqueID){	
			//console.log(uniqueID);
					var graphic = activityModel.get("f."+uniqueID).graphic;
					dojo.hitch(null,appModel.get("app.activitiesController").hoverOutActivity,graphic)();
					//appModel.get("app.KOModel").currentDescription(appModel.get("app.KOModel").previousDescription());	
					//appModel.get("app.KOModel").currentTitle(appModel.get("app.KOModel").previousTitle());
				}
				
			this.activityNavClickAttach = function(){
					dojo.publish(Events.removeAllHandlers,["activityPageEventHandlers"]);				
					
					var prevActivityClickHandler = dojo.connect(dojo.byId("prevActivity"),eventType.onclick,dojo.hitch(that,"imageClickHandler","prev"));
					dojo.publish(Events.addHandler,[appModel.get("app.activityPageEventHandlers"),prevActivityClickHandler]);
					
					var nextActivityClickHandler = dojo.connect(dojo.byId("nextActivity"),eventType.onclick,dojo.hitch(that,"imageClickHandler","next"));
					dojo.publish(Events.addHandler,[appModel.get("app.activityPageEventHandlers"),nextActivityClickHandler]);
			}
			
			this.imageClickHandler = function(uniqueID){
			
					
					if (uniqueID=="prev"){
					uniqueID=appModel.get("app.prevUniqueID");
					}
					if (uniqueID=="next"){
					uniqueID=appModel.get("app.nextUniqueID");
					}
					var pos = parseInt(activityModel.getUniqueIdPosition(uniqueID));
					//alert(uniqueID);
					//alert(pos);
					appModel.get("app.KOModel").activityCurrent(pos);
					
					var total = appModel.get("app.KOModel").activityTotal();
					if (pos > 1){
						dojo.style("prevActivity","visibility","visible");
						var prevUniqueID = activityModel.getUniqueIdByPosition(pos-1);
						appModel.set("prevUniqueID",prevUniqueID);					
					}
					
					if (pos < total){						
						dojo.style("nextActivity","visibility","visible");
						var nextUniqueID = activityModel.getUniqueIdByPosition(pos+1);
						appModel.set("nextUniqueID",nextUniqueID);						
					} 
					
					
					var projectID = uniqueID.split(".")[0];
					var activityID = uniqueID.split(".")[1];
					projectID = projectID.substring(1);
					activityID = activityID.substring(1);		
					//alert("FlickController " + projectID);
					console.log("---->shared from handleNavigation");	
					dojo.publish(Events.shareURLupdate,[appModel.get("app.queryShareURL"),projectID,activityID]);
			
					dojo.publish(Events.removeAllHandlers,["activityCarouselEventHandlers"]);
					
				
					var graphic = activityModel.get("f."+uniqueID).graphic;
					
					if (graphic.getDojoShape()){
					graphic.getDojoShape().moveToFront();
					}
					
					
					appModel.set("activitiesSelectedGraphic",graphic);
					dojo.publish(Events.zoomToGraphic,[graphic,"activity"]);

					var geom = new esri.geometry.Point(graphic.geometry.x,graphic.geometry.y,new esri.SpatialReference({wkid:102100}));
					
					dojo.publish(Events.clearMapGraphics,["flickrController imageClickHandler"]); 
					console.log("about to add pointer");
					var pointerGraphic = new esri.Graphic(geom,appModel.get("app.pointerSymbol"));
					appModel.get("app.map").graphics.add(pointerGraphic);
					//clearMapGraphics
					//console.log(activityModel.get("f."+uniqueID));			
					
					appModel.get("app.KOModel").currentTitle(activityModel.get("f."+uniqueID+".title"));
					//appModel.get("app.KOModel").currentTitleActivities(activityModel.get("f."+uniqueID+".title"));					
					appModel.get("app.KOModel").currentDescription(activityModel.get("f."+uniqueID+".description"));
					appModel.get("app.KOModel").currentDescriptionMinimized(true);	
					appModel.get("app.KOModel").currentDescriptionHeight(parseInt(dojo.style("storyDescription","height")));
									
					appModel.get("app.KOModel").currentTitleActivity(activityModel.get("f."+uniqueID+".title"));	
					appModel.get("app.KOModel").currentDescriptionActivity(activityModel.get("f."+uniqueID+".description"));
					
					console.log("Minimized? " + appModel.get("app.KOModel").currentDescriptionMinimized());
					console.log("Content Height - " + appModel.get("app.KOModel").currentDescriptionHeight());
					

					fireEvent('navigation',['ActivityContainer']);
					//dojo.byId("activityGallery").innerHTML  = "";
					dojo.place("<span></span>","activityGallery","only");

					
					//Carousel Media Belt
					var counter = 0;
					//console.log("UniqueID " + uniqueID);
					
					var media = activityModel.get("f."+uniqueID).media;
					//console.dir(media);
					if (media && media.length>1){
						//console.dir(activityModel.get("f."+uniqueID).media);
						dojo.style("activityGalleryContainer","display","block");

						dojo.removeClass("stackContainer","stackContainerNoCarousel");
						dojo.addClass("stackContainer","stackContainer");	

					} else {
						//media = [];
						dojo.style("activityGalleryContainer","display","none");

						dojo.removeClass("stackContainer","stackContainer");
						dojo.addClass("stackContainer","stackContainerNoCarousel");						
					}

					
					
					
					var stackContainerHeight = 0;
					var activityGalleryHeight = 960;
					var activityDisplayContainerHeight = 0;
					var totalBeltWidth=100;
					dojo.forEach(media,function(mediaItem){	
						if (mediaItem!=undefined){
							console.log("MEDIA ITEM ------------------");
							console.log(mediaItem);
							if (mediaItem.length==2){//is a before after
								//console.log("Render before after");
								if (stackContainerHeight < 545){
								stackContainerHeight = 545;
								}
								if (activityDisplayContainerHeight < 400){
								activityDisplayContainerHeight = 400;
								}
								
									totalBeltWidth +=190;
									console.log("ba " + totalBeltWidth);
									var item = mediaItem;
									//console.log(items);
									dojo.place("<div id='imageBeforeAfter"+counter+"' class='activityGroup activityItemImageBeforeAfter'></div>","activityGallery");
									if (item[0]){
									dojo.place("<img  src='"+item[0].image+"' class='activityItemImage'/>","imageBeforeAfter"+counter);
									}
									if (item[1]){
									dojo.place("<img  src='"+item[1].image+"' class='activityItemImage'/>","imageBeforeAfter"+counter);
									} 
							
							var imgBeforeAfterHandle = dojo.connect(dojo.byId("imageBeforeAfter"+counter),eventType.onclick,dojo.hitch(that,"galleryBeforeAfterImageHandler",uniqueID,counter));
							dojo.publish(Events.addHandler,[appModel.get("app.activityCarouselEventHandlers"),imgBeforeAfterHandle]);
							//console.log("imageBeforeAfter"+counter);
							if (counter==0){
							dojo.hitch(that,"galleryBeforeAfterImageHandler",uniqueID,0)();}
							counter++;
					} 
					else 
					{
							if (mediaItem.type == "video") {//is a video
								if (stackContainerHeight < 435){
								stackContainerHeight = 435;
								}
								if (activityDisplayContainerHeight < 290){
								activityDisplayContainerHeight = 290;
								}
								console.log("Render Video");
								totalBeltWidth +=90;	
								//alert("vid " + totalBeltWidth);					
								var item = mediaItem;
								console.log(item);								
								dojo.place("<img id='imageVideo"+counter+"' width='85' height='85' title='"+item.description+"' class='activityItemImage' src='"+item.thumbnail+"'/>","activityGallery");								
								var vidHandle = dojo.connect(dojo.byId("imageVideo"+counter),eventType.onclick,dojo.hitch(that,"galleryVideoHandler",uniqueID,counter));
								dojo.publish(Events.addHandler,[appModel.get("app.activityCarouselEventHandlers"),vidHandle]);														
								if (counter==0){
								dojo.hitch(that,"galleryVideoHandler",uniqueID,0)();}
								counter++;
							}
							if (mediaItem.type == "imagesingle") {//is a single image
								//console.log("Render Single Image");
								if (stackContainerHeight < 435){
								stackContainerHeight = 435;
								}
								if (activityDisplayContainerHeight < 290){
								activityDisplayContainerHeight = 290;
								}							
								totalBeltWidth +=90;
								console.log("single " + totalBeltWidth);
								var item = mediaItem;
								var description = item.description;
								
								dojo.place("<img id='imageSingle"+counter+"'  width='85' height='85' title='"+description+"' class='activityItemImage' src='"+item.image+"'/>","activityGallery");								
								var imgHandle = dojo.connect(dojo.byId("imageSingle"+counter),eventType.onclick,dojo.hitch(that,"gallerySingleImageHandler",uniqueID,counter));
								dojo.publish(Events.addHandler,[appModel.get("app.activityCarouselEventHandlers"),imgHandle]);						
								if (counter==0){
								dojo.hitch(that,"gallerySingleImageHandler",uniqueID,0)();}
								counter++;				
							}
					}
					
					}//mediaItem!=undefined
					});
					//alert(totalBeltWidth);
					if (media.length<2){
						stackContainerHeight = activityDisplayContainerHeight+30;
					}

					dojo.publish(Events.resizeContent,["stackContainer","height",stackContainerHeight]);

					dojo.style("activityGallery","width",totalBeltWidth+"px");
					dijit.byId("activityGalleryWrapper").scrollTo({x:0});


					dojo.style("activityDisplayContainer","height",activityDisplayContainerHeight+"px");
					//alert(dojo.style("activityGallery","width"));
					if (dojo.style("activityGallery","width")<865){
					dojo.style("activityNav","visibility","hidden");					
					} else {
					dojo.style("activityNav","visibility","visible");
					}	

					
				//alert("carousel");	
				
				//after creating carousel connect click event to next prev
				var prevBeltClickHandler = dojo.connect(dojo.byId("prevBelt"),eventType.onclick,dojo.hitch(that,"shiftBelt","left"));
				dojo.publish(Events.addHandler,[appModel.get("app.activityCarouselEventHandlers"),prevBeltClickHandler]);
				var nextBeltClickHandler = dojo.connect(dojo.byId("nextBelt"),eventType.onclick,dojo.hitch(that,"shiftBelt","right"));								
				dojo.publish(Events.addHandler,[appModel.get("app.activityCarouselEventHandlers"),nextBeltClickHandler]);
				
				

				
				}
				
				this.shiftBelt = function(value){	
				var px = 80;

				var currPos = dijit.byId("activityGalleryWrapper").getPos().x;

				var maxRight = (dojo.style("activityGallery","width")-720)*-1;
				var maxLeft = 100;
			
				if (value=="right"){	
					if ((appModel.get("app.currentCarouselPosition")-80)<maxRight){
						//appModel.set("currentCarouselPosition",0);//reset to start
						console.log(appModel.get("app.currentCarouselPosition"));
					}	else { appModel.set("currentCarouselPosition",currPos-80)}					
					dijit.byId("activityGalleryWrapper").scrollTo({x:appModel.get("app.currentCarouselPosition")});
					//dojo.byId("activityGalleryWrapper").scrollLeft += px;
					} else {
					if ((appModel.get("app.currentCarouselPosition")+80)>maxLeft) {
						appModel.set("currentCarouselPosition",maxLeft);
						console.log(appModel.get("app.currentCarouselPosition"));
					}	else { appModel.set("currentCarouselPosition",currPos+80)}			
					dijit.byId("activityGalleryWrapper").scrollTo({x:appModel.get("app.currentCarouselPosition")});
					//dojo.byId("activityGalleryWrapper").scrollLeft -= px;										
					}
				},
				
				this.galleryVideoHandler = function(uniqueID,items){
				var videoURL = activityModel.get("f."+uniqueID).media[items].videoURL;
				var description = activityModel.get("f."+uniqueID).media[items].description;
				if (description=="none" || description.length==0 ){
					description = appModel.get("app.KOModel").currentTitle();
				}
				dojo.place("<div class='seven columns imgBlock'><iframe class='youtube-player imgMainSingleBox' type='text/html' width='445' height='265' src='"+videoURL+"' frameborder='0'></iframe><div>","activityDisplayContainer","only");
				dojo.place("<div class='seven columns offset-by-eight' id='descBlock'><div class='photoTextSingle' id='singleTextBlock'>"+description+"</div></div>","activityDisplayContainer");
				//dojo.place("<div class='seven columns imgBlock'><div class='imgMainSingleBox' style='"+imgCalc.boxStyle+"'></div><img class='imgMainSingle' style='clip:"+imgCalc.clipStyle+";margin:"+imgCalc.marginStyle+";' title='"+description+"' src='"+imageURL+"'/></div><a href='"+flickrURL+"' target='_blank' class='flickrImg link'>Image from Flickr Courtesy World Bank</a>","activityDisplayContainer","only");							
			//dojo.place("<div class='seven columns offset-by-eight' id='descBlock'><div class='photoTextSingle' id='singleTextBlock'>"+description+"</div></div>","activityDisplayContainer");
				
					dojo.query(".activityItemImageCurrent").forEach(function(node){
						dojo.addClass(node,"activityItemImage");
						dojo.removeClass(node,"activityItemImageCurrent");						
					});
					
					dojo.query(".activityItemImageBeforeAfterCurrent").forEach(function(node){
						dojo.addClass(node,"activityItemImageBeforeAfter");
						dojo.removeClass(node,"activityItemImageBeforeAfterCurrent");	
					});
							
					dojo.removeClass("imageVideo"+items,"activityItemImage");
					dojo.addClass("imageVideo"+items,"activityItemImageCurrent");

				}
				
				this.gallerySingleImageHandler = function(uniqueID,items){				
					//console.log(activityModel.get("f."+activityID).images[items].smallimage);
					//console.log("uniqueID" + uniqueID + "item - " + items);
					
					dojo.query(".activityItemImageCurrent").forEach(function(node){
						dojo.addClass(node,"activityItemImage");
						dojo.removeClass(node,"activityItemImageCurrent");						
					});
					
					dojo.query(".activityItemImageBeforeAfterCurrent").forEach(function(node){
						dojo.addClass(node,"activityItemImageBeforeAfter");
						dojo.removeClass(node,"activityItemImageBeforeAfterCurrent");	
					});
							
					dojo.removeClass("imageSingle"+items,"activityItemImage");
					dojo.addClass("imageSingle"+items,"activityItemImageCurrent");
					
					
					var imageURL = activityModel.get("f."+uniqueID).media[items].mediumImage;
					var flickrOwner = activityModel.get("f."+uniqueID).media[items].flickrOwner;
					var flickrID = activityModel.get("f."+uniqueID).media[items].flickrID;
					var flickrURL = "http://www.flickr.com/"+flickrOwner+"/"+flickrID;
					//calculate W and H, clip to 435*255 217.5*127.5
					var imageW = activityModel.get("f."+uniqueID).media[items].mediumW;
					var imageH = activityModel.get("f."+uniqueID).media[items].mediumH;
					var imgCalc = that.imageCalculate(imageW,imageH,"single");
					//console.log("imgCalc.shiftLeft " + imgCalc.shiftLeft);
					
					var description = activityModel.get("f."+uniqueID).media[items].description;
					//dojo.place("<div class='fourteen columns' ><img align='left' class='imgMainSingle' title='"+description+"' src='"+imageURL+"'/><span class='photoText'>some text goes here. some text goes here. some text goes here. some text goes here. some text goes here</span></div>","activityDisplayContainer","only");					


					dojo.place("<div class='seven columns imgBlock'><div class='imgMainSingleBox' style='"+imgCalc.boxStyle+"'></div><img class='imgMainSingle' style='clip:"+imgCalc.clipStyle+";margin:"+imgCalc.marginStyle+";' title='"+description+"' src='"+imageURL+"'/></div><a href='"+flickrURL+"' target='_blank' class='flickrImg link'>Image from Flickr Courtesy World Bank</a>","activityDisplayContainer","only");							
					dojo.place("<div class='seven columns offset-by-eight' id='descBlock'><div class='photoTextSingle' id='singleTextBlock'>"+description+"</div></div>","activityDisplayContainer");
					
					
					if (dojo.style("singleTextBlock","height")>310) {
					dojo.style("singleTextBlock","height","290px");
					dojo.place("<span class='readmore link' id='singleReadmore'>read more</span>","descBlock","last");
					var tip = new dijit.Tooltip({
							label: description,
							showDelay: 100,
							connectId: ["singleReadmore"]
					});
					}

				}
				
				this.galleryBeforeAfterImageHandler = function(uniqueID,items){
					
					dojo.query(".activityItemImageBeforeAfterCurrent").forEach(function(node){
						dojo.addClass(node,"activityItemImageBeforeAfter");
						dojo.removeClass(node,"activityItemImageBeforeAfterCurrent");					
					});
					dojo.query(".activityItemImageCurrent").forEach(function(node){
						dojo.addClass(node,"activityItemImage");
						dojo.removeClass(node,"activityItemImageCurrent");						
					});
					
					if (dojo.byId("imageBeforeAfter"+items)){		
					dojo.removeClass("imageBeforeAfter"+items,"activityItemImageBeforeAfter");
					dojo.addClass("imageBeforeAfter"+items,"activityItemImageBeforeAfterCurrent");
					}
					
					//console.dir(flickrModel.get("f"));
					//console.log(items);
				if (activityModel.get("f."+uniqueID).media[items][0]){					
					var imageBeforeURL = activityModel.get("f."+uniqueID).media[items][0].mediumImage || "";
					var flickrOwnerB = activityModel.get("f."+uniqueID).media[items][0].flickrOwner;
					var flickrIDB = activityModel.get("f."+uniqueID).media[items][0].flickrID;
					var flickrURLB = "http://www.flickr.com/"+flickrOwnerB+"/"+flickrIDB;
					var imageWB = activityModel.get("f."+uniqueID).media[items][0].mediumW;
					var imageHB = activityModel.get("f."+uniqueID).media[items][0].mediumH;
					var imgCalcB = that.imageCalculate(imageWB,imageHB,"before");
					var descriptionBefore = activityModel.get("f."+uniqueID).media[items][0].description;											
					dojo.place("<div class='seven columns' id='beforeBlock'><div class='imgMainSingleBox' style='"+imgCalcB.boxStyle+"'></div><img class='imgMainSingle' style='clip:"+imgCalcB.clipStyle+";margin:"+imgCalcB.marginStyle+";' title='"+descriptionBefore+"' src='"+imageBeforeURL+"'/></div><a href='"+flickrURLB+"' target='_blank' class='flickrImg link'>Image from Flickr Courtesy World Bank</a>","activityDisplayContainer","only");		
					dojo.place("<div class='photoTextB' id='beforeTextBlock'><strong>Before</strong><br>"+descriptionBefore+"</div>","activityDisplayContainer");
					
						if (dojo.style("beforeTextBlock","height")>115) {
							dojo.style("beforeTextBlock","height","100px");
							dojo.place("<span class='readmore link' id='beforeReadmore'>read more</span>","beforeBlock","last");
							var tip1 = new dijit.Tooltip({
									label: descriptionBefore,
									showDelay: 100,
									connectId: ["beforeReadmore"],
									style:"width:300px"
							});
							}
					}
					
				if (activityModel.get("f."+uniqueID).media[items][1]){
					var imageAfterURL = activityModel.get("f."+uniqueID).media[items][1].mediumImage || "";
					var flickrOwnerA = activityModel.get("f."+uniqueID).media[items][1].flickrOwner;
					var flickrIDA = activityModel.get("f."+uniqueID).media[items][1].flickrID;
					var flickrURLA = "http://www.flickr.com/"+flickrOwnerA+"/"+flickrIDA;
					var imageWA = activityModel.get("f."+uniqueID).media[items][1].mediumW;
					var imageHA = activityModel.get("f."+uniqueID).media[items][1].mediumH;
					var imgCalcA = that.imageCalculate(imageWA,imageHA,"after");					
					var descriptionAfter = activityModel.get("f."+uniqueID).media[items][1].description;					
					dojo.place("<div class='seven columns' id='afterBlock'><div class='imgMainSingleBoxAfter' style='"+imgCalcA.boxStyle+"'></div><img class='imgMainSingleAfter' style='clip:"+imgCalcA.clipStyle+";margin:"+imgCalcA.marginStyle+";' title='"+descriptionAfter+"' src='"+imageAfterURL+"'/></div><a href='"+flickrURLA+"' target='_blank' class='flickrImgAfter link'>Image from Flickr Courtesy World Bank</a>","activityDisplayContainer");							
					dojo.place("<div class='photoTextA' id='afterTextBlock'><strong>After</strong><br>"+descriptionAfter+"</div>","activityDisplayContainer");
					
						if (dojo.style("afterTextBlock","height")>115) {
							dojo.style("afterTextBlock","height","100px");
							dojo.place("<span class='readmore link' id='afterReadmore'>read more</span>","afterBlock","last");
							var tip2 = new dijit.Tooltip({
									label: descriptionAfter,
									showDelay: 100,
									connectId: ["afterReadmore"],
									style:"width:300px"
							});
						}
					}
					


				}
				
				this.imageCalculate = function(width,height,type){
					var results = [];
					//console.log("width " + width);
					//console.log("height " + height);
					var clipW = 435;
					var clipWmid = (clipW/2);
					var clipH = 255;
					var clipHmid = (clipH/2);
					var imageW = width;
					var imageH = height;
					var clipLeft,clipRight,clipTop,clipBottom;
					var marginTop = marginLeft = marginRight = "0px";
					var boxW,boxH;

					
					if (parseInt(imageW)>clipW){
						var imageWCenter = imageW/2;
						clipLeft = imageWCenter-clipWmid + "px";
						clipRight = imageWCenter+clipWmid + "px";
						marginLeft = ((imageWCenter-clipWmid-15)*-1).toString()+"px";
						marginRight = ((imageWCenter-clipWmid-15)*-1).toString()+"px";				
						boxW="445px";
					} else {		
						var imageWCenter = imageW/2;					
						marginLeft = Math.abs((imageWCenter-clipWmid-15)).toString()+"px";
						marginRight = Math.abs((imageWCenter-clipWmid-15)).toString()+"px";	
						clipLeft="0px";
						clipRight = imageW.toString()+"px";
						boxW=(parseInt(imageW)+10).toString()+"px";
					}
					
					
					var imageHCenter = imageH/2;
					if ((imageHCenter-clipHmid-15)<0){
							marginTop = Math.abs(imageHCenter-clipHmid-15).toString()+"px";
						} else {
							marginTop = ((imageHCenter-clipHmid-15)*-1).toString()+"px";
						}
					if (parseInt(imageH)>clipH){
						
						clipTop = imageHCenter-clipHmid + "px";
						clipBottom = imageHCenter+clipHmid + "px";						
						//console.log("less or more " + (imageHCenter-clipHmid-15).toString());						
						//console.log(marginTop);
						boxH="265px";
					}else {
						//marginTop="30px";
						clipTop="0px";
						clipBottom = imageH.toString()+"px";
						boxH=(parseInt(imageH)+10).toString()+"px";
					}
					
					boxW = "445px";
					boxH = "265px";
					
					var clipStyle = "rect("+clipTop+" "+clipRight+" "+clipBottom+" "+clipLeft+")";
					var marginStyle = marginTop +" 0px 0px " + marginLeft;
					//console.log("before margin " + marginStyle);
					if (type=="after"){
					marginStyle = marginTop +" "+ marginRight + " 0px 0px";
					}
					//console.log("after margin " + marginStyle);
					var boxStyle = "width:"+boxW+";height:"+boxH;

					results.clipStyle = clipStyle;
					results.marginStyle = marginStyle;
					results.boxStyle = boxStyle;
					//results.shiftLeft = shiftLeft;
					//results.shiftRight = shiftRight;
					
					/*console.log("clipStyle " + results.clipStyle);
					console.log("marginStyle " + results.marginStyle);
					console.log("boxStyle " + results.boxStyle);
					console.log("shiftLeft " + results.shiftLeft);
					console.log("shiftRight " + results.shiftRight);*/
					//console.log("marginStyle " + results.marginStyle);
					//console.log("marginTop " + marginTop);
					
					
					return results;
				
				
				}
			 
	 
			


			

	}