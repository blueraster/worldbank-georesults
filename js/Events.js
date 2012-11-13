var Events = {
loadedWebmap:"loadWebmap",
createProjectsGraphicsLayer:"createProjectsGraphicsLayer",
createActivitiesGraphicsLayer:"createActivitiesGraphicsLayer",
loadActivityModel:"loadActivityModel",
loadFlickrUI:"loadFlickrUI",
setProjectDefaultImages:"setProjectDefaultImages",
loadYoutubeModel:"loadYoutubeModel",
clearMapGraphics:"clearMapGraphics",
clearInfoWindow:"clearInfoWindow",
searchText:"searchText",
navigation:"navigation",
zoomToGraphics:"zoomToGraphics",
zoomToGraphic:"zoomToGraphic",
animateHeight:"animateHeight",
addHandler:"addHandler",
removeAllHandlers:"removeAllHandlers",
resizeContent:"resizeContent",
shareURLupdate:"shareURLupdate",
extentChange:"extentChange"
}

//universal function to fire events
var fireEvent = function (eventName, dataArray){
dojo.publish(eventName,dataArray);
};

var EventHandlers = function (){

var handleloadedWebmap = dojo.subscribe(Events.loadedWebmap,function(data) {
appModel.get("app.webmapController").loadedWebmap(data);
dojo.disconnect(handleloadedWebmap);
console.log("handleloadedWebmap");
});

var handleCreateProjectsGraphicsLayer = dojo.subscribe(Events.createProjectsGraphicsLayer,function(items,request) {
appModel.get("app.projectsController").createProjectsGraphicsLayer(items,request);
dojo.disconnect(handleloadedProjects);
});

var handleCreateActivitiesGraphicsLayer = dojo.subscribe(Events.createActivitiesGraphicsLayer,function(items,request) {
appModel.get("app.activitiesController").createActivitiesGraphicsLayer(items,request);
});

var handleloadedActivityModel = dojo.subscribe(Events.loadActivityModel,function(response,user) {
appModel.get("app.flickrController").loadActivityModel(response,user);
});

var handleloadedFlickrUI = dojo.subscribe(Events.loadFlickrUI,function(projectID,projectFlickr) {
appModel.get("app.flickrController").loadFlickrUI(projectID,projectFlickr);
});

var handleloadedSetProjectDefaultImages = dojo.subscribe(Events.setProjectDefaultImages,function(response,io) {
appModel.get("app.projectsController").setProjectDefaultImages(response,io);
});

var handleloadedYoutubeModel = dojo.subscribe(Events.loadYoutubeModel,function(projectID, response,io) {
appModel.get("app.youtubeController").loadYoutubeModel(projectID, response,io);
});

var handleMapGraphicsClear = dojo.subscribe(Events.clearMapGraphics,function(msg) {
appModel.get("app.appController").clearMapGraphics(msg);

});

var handleMapInfoWindowClear = dojo.subscribe(Events.clearInfoWindow,function() {
appModel.get("app.appController").clearInfoWindow();

});

var handleSearchText = dojo.subscribe(Events.searchText,function(value) {
//appModel.get("app.projects").projectsStore.fetch({query: {Project : "*value", Country : "*value"} });
appModel.get("app.appController").searchProjects();
});

var handleNavigation = dojo.subscribe(Events.navigation,function(type,menuClicked) {
appModel.get("app.appController").handleNavigation(type,menuClicked);
});

var handleZoomToGraphics = dojo.subscribe(Events.zoomToGraphics,function(graphics,level) {
appModel.get("app.appController").handleZoomToGraphics(graphics,level);
});

var handleZoomToGraphic = dojo.subscribe(Events.zoomToGraphic,function(graphic,type) {
console.log("handleZoomToGraphic");
appModel.get("app.appController").handleZoomToGraphic(graphic);
});

var handleAnimateHeight = dojo.subscribe(Events.animateHeight,function(containerID,contentID,expand) {
appModel.get("app.appController").animateHeight(containerID,contentID,expand);
});

var handleAddHandler = dojo.subscribe(Events.addHandler,function(handleArray,handle) {
appModel.get("app.appController").addHandler(handleArray,handle);
});

var handleRemoveAllHandlers = dojo.subscribe(Events.removeAllHandlers,function(handleArray) {
appModel.get("app.appController").removeAllHandlers(handleArray);
});

var handleResizeContent = dojo.subscribe(Events.resizeContent,function(divId,dimension,pixels) {
appModel.get("app.appController").resizeContent(divId,dimension,pixels);
});

var handleShareURLupdate = dojo.subscribe(Events.shareURLupdate,function(url,project,activity) {
appModel.get("app.appController").shareURLupdate(url,project,activity);
});

var handleExtentChange = dojo.subscribe(Events.extentChange,function(extent) {
appModel.get("app.appController").extentChange(extent);
});


}


