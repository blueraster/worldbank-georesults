//dojo.require("dijit.dijit"); // optimize: load dijit layer
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("esri.map");
//dojo.require("dojox.grid.DataGrid");
dojo.require("dojox.data.CsvStore");
//dojo.require("dijit.form.ComboBox");
//dojo.require("dojox.data.FlickrStore");
dojo.require("esri.layers.FeatureLayer");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.layout.StackContainer");
dojo.require("dijit.form.Button");
//dojo.require("dojox.image.Gallery");
//dojo.require("dojox.data.FlickrRestStore");
//dojo.require("dojox.image.ThumbnailPicker");
dojo.require("dojo.parser");
dojo.require("dijit.form.TextBox");
//dojo.require("dojo.window");
dojo.require("dijit.TitlePane");
dojo.require("esri.dijit.BasemapGallery");
dojo.require("esri.arcgis.utils");
dojo.require("esri.layers.graphics");
dojo.require("dijit.Tooltip");
dojo.require("dojox.gesture.tap");
dojo.require("dojox.xml.parser");
dojo.require("dojox.xml.DomParser");
dojo.require("dojo.window");
dojo.require("esri.geometry");
dojo.require("dojox.dtl.filter.strings");
dojo.require("dojox.mobile.ScrollableView");
dojo.require("dojo.hash");
//dojo.require("dojox.html.entities");
//dojo.require("dojo.back");


 
dojo.ready(init);


function init() {

//esri.config.defaults.io.proxyUrl = "/proxy/proxy.ashx";
//esri.config.defaults.io.alwaysUseProxy = false;

Modernizr.load({
  test: Modernizr.touch,
  yep : 'js/mouseEventsTablet.js',
  nope: 'js/mouseEventsDesktop.js'
});

Modernizr.load({
  test: Modernizr.touch,
  nope : 'stylesheets/desktop.css'
});



var eventHandlers = new EventHandlers();
dojo.connect(dojo.byId("projectsSearch"), "onkeyup", function(e){
	appModel.set("currentSearchText",this.value);
	dojo.publish(Events.searchText,[]);
	appModel.get("app.KOModel").currentInput(appModel.get("app.currentSearchText"));	
});



appModel.set("defaultSymbol",new esri.symbol.PictureMarkerSymbol('images/Legend/map-marker-activity.png',22,24));	 
appModel.set("pointerSymbol",new esri.symbol.PictureMarkerSymbol('images/pointer-marker.png',25,25).setOffset(20,0));	 
appModel.set("highlightSymbol",new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,30,new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,new dojo.Color([255,0,0]), 1),new dojo.Color([0,255,0,0.25])));





appModel.set("initBasemap",new esri.layers.ArcGISTiledMapServiceLayer(appDefault.get("config").basemapURL,{displayLevels:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}));
dojo.connect(appModel.get("app.initBasemap"), "onLoad", initMap);
	
}

function navigateTo(page){
fireEvent('navigation',[page,true]);
}

function filterCountry(){
navigateTo('StoriesContainer');
dijit.byId("countriesFilteringSelect").set("value", appModel.get("app.KOModel").currentCountry());
appModel.get("app.KOModel").currentTitleLinks("");	
appModel.get("app.KOModel").linkCountryEnabled(true);
appModel.get("app.KOModel").linkRootActive(true);
//console.log("---->shared from FILTERCOUNTRY");
//dojo.publish(Events.shareURLupdate,[appModel.get("app.queryShareURL"),"none","none"]);
}

function animateHeight(container,targetDiv,expand){
fireEvent('animateHeight',[container,targetDiv, expand]);
}

function clearSearch(type){
switch (type){
case "countries":
appModel.set("currentSearchCountry","");
appModel.get("app.KOModel").currentCountry("");
dijit.byId("countriesFilteringSelect").set("value", "");
//console.log("---->shared from CLEARSEARCH");
//dojo.publish(Events.shareURLupdate,[appModel.get("app.queryShareURL"),"none","none"]);	
break;
case "input":
dojo.byId("projectsSearch").value = "";
appModel.set("currentSearchText","");
appModel.get("app.KOModel").currentInput("");
dojo.publish(Events.searchText,[]);
break;
}
}

function initMap(baseLayer){

initControllers();
 
appModel.set("map",new esri.Map("map",appDefault.get("map")));//,{infoWindow:infoWindow});
var mapLoad = dojo.connect(appModel.get("app.map"), 'onLoad', function(theMap) {
  //resize the map when the browser resizes
  dojo.connect(theMap, 'resize', theMap,theMap.resize);
  //print extents and level
   dojo.connect(theMap, "onExtentChange", function(extent){
  	 dojo.publish(Events.extentChange,[extent]);
   });

   dojo.disconnect(mapLoad);
});
appModel.get("app.map").addLayer(appModel.get("app.initBasemap"));

dojo.query(".simpleInfoWindow").forEach(function(node){
dojo.style(node,"width","");
dojo.style(node,"height","30px");
dojo.style(node,"max-height","100px");
});
//appModel.get("app.map").infoWindow.resize(200, 35);


//Add basemap
var basemapGallery = new esri.dijit.BasemapGallery({
  showArcGISBasemaps: true,
  map: appModel.get("app.map")
}, "basemapGallery");

basemapGallery.startup();

dojo.connect(basemapGallery,"onLoad",function(){
    //var basemap = basemapGallery.getSelected(); 
	basemapGallery.select(appDefault.get("config").defaultBasemap);
  });


initBindingEvents();

initShare();

//Finally
initWebmap();
//alert(dojo.style("storyDescription","height"));
appModel.get("app.KOModel").currentDescriptionHeight(parseInt(dojo.style("storyDescription","height")));
//appModel.get("app.KOModel").currentDescriptionMinimized(false);
appModel.get("app.KOModel").currentDescriptionMinimized(true);

if (dojo.style("storyDescription","height")>60) {//expand homepage desc by default if long
animateHeight('storyDescriptionContainer','storyDescription', true);
}

	
}

function initBindingEvents(){
//Initialize the Event Handlers
appModel.set("projectsEventHandlers",new Array());
appModel.set("activitiesEventHandlers",new Array());
appModel.set("activityCarouselEventHandlers",new Array());
appModel.set("activityPageEventHandlers",new Array());




//Initialize Knockout
appModel.set("KOModel",new KOModel);
ko.applyBindings(appModel.get("app.KOModel"));
}

function initControllers(){

//Initialize the Controllers

appModel.set("appController",new AppController());
appModel.set("webmapController",new WebmapController());
appModel.set("mapController",new MapController());
appModel.set("projectsController",new ProjectsController());
appModel.set("activitiesController",new ActivitiesController());
appModel.set("flickrController",new FlickrController());
appModel.set("youtubeController",new YoutubeController());

appModel.set("flickrLoader",FlickrLoader.getInstance({}));
appModel.set("activitiesLoader",ActivitiesLoader.getInstance({}));
appModel.set("youtubeLoader",YoutubeLoader.getInstance({}));



}

function initWebmap(){
//Initialize Projects
appModel.set("webmap",WebmapLoader.getInstance({
			webmapURL: appDefault.get("config").webmapURL,
			webmap: appDefault.get("config").webmap
			}));



//Load WebMap
appModel.get("app.webmap").loadWebmapData();

//projects.loadProjects();
}


var updateHashByClick = false;

function initShare(){
  var uri = ""
 //

 var referrerURL =  document.referrer;
 var documentURL = document.location.href;
 var documentURLsplit = documentURL.split("://");
 documentURL = "http://"+documentURLsplit[1].split("/")[0];


//alert(documentURL);


if (referrerURL.indexOf(documentURL)>-1 || document.referrer==""){
	//document is contained in the same domain
	uri = parent.location.href;//
} else {
	//document is contained or reffered by different domain

	if (window.top != window.self)
 	{//is in iframe
 		uri = referrerURL;
	} else {
		uri = document.location.href;
	}

		
}

//alert(uri);

var url = uri.split("#")[0];
var query = uri.split("#")[1];




appModel.set("queryShareURL",url);	
var p  = "none";
var a  = "none";
console.log(query);
if (query!=undefined){
	var queryObject = dojo.queryToObject(query);  
	console.log(queryObject);
	if (queryObject["project"]){
		appModel.set("queryProjectID","P"+queryObject["project"]);
		}
	if (queryObject["activity"]){
		appModel.set("queryActivityID","A"+queryObject["activity"]);
		}	
	p  = queryObject["project"] || "none";
	a  = queryObject["activity"] || "none";
}



//dojo.hash("#");
//alert("main initShare" + queryObject["project"]);
//if (uri.indexOf("#")>-1){
console.log("---->shared from INITSHARE");
dojo.publish(Events.shareURLupdate,[appModel.get("app.queryShareURL"), p.toString(), a.toString()]);	
//}

//Monitor Change in URL		
dojo.subscribe("/dojo/hashchange", function (hash){	
	 	if (!updateHashByClick)	{
		var hashObj = dojo.queryToObject(hash);
		
		if (hashObj.activity){
		dojo.hitch(appModel.get("app.flickrController"),"imageClickHandler","P"+hashObj.project.toUpperCase()+".A"+hashObj.activity)();
		return;
		}

		if (hashObj.project){
		dojo.hitch(appModel.get("app.projectsController"),"projectClickHandler","P"+hashObj.project.toUpperCase())();
		return;
		}

		
		alert("navigate home");
		//go to home
		navigateTo('StoriesContainer');

		}
	});
	
}









