var YoutubeController = function(){
		var that = this;
		this.loadYoutubeModel = function(projectID, items, request){

			console.log("YoutubeController > loadYoutubeModel");
			//alert(projectID);
			var searchObject = [];
			searchObject["ProjectID"] = projectID;
			appModel.get("app.activitiesLoader").activitiesStore.fetch({query: searchObject, onComplete: dojo.partial(that.filterActivities,items), queryOptions: {ignoreCase:true}});	
				
			
				
			}

			this.filterActivities = function(youtubeitems, items, request) {

				//console.log(youtubeitems);
				var jsdom = dojox.xml.DomParser.parse(youtubeitems);			
				var entries = jsdom.getElementsByTagName("entry");			
				//console.log(entries);			
				//console.log(entries.length);
				var videosActivity = [];
				var activitiesStore = appModel.get("app.activitiesLoader").activitiesStore;
				for(var i = 0; i < items.length; i++){
						var item = items[i];
						var videos = activitiesStore.getValue(item,"Videos");
						console.log("videos " + videos);
						var activityID = activitiesStore.getValue(item,"ActivityID");
						var projectID = activitiesStore.getValue(item,"ProjectID");
						console.log("activityID " + activityID);
						if (videos!="none"){
						var videosArray = videos.split("|");						
						dojo.forEach(videosArray,function(video){
							videosActivity[video.split(":")[0]] = {activityID:activityID,order:video.split(":")[1]}
						});
						}
				}
				
				
				for (var i = 0; i < entries.length; i++) {
				
				var entry = entries[i];
				console.log(entry);
				var title = entry.getElementsByTagName("media:title")[0].childNodes[0].nodeValue;
				//console.log("title " + title);
				var thumbnail = entry.getElementsByTagName("media:thumbnail")[0].attributes[0].nodeValue;
				//entry.getElementsByTagName("media:content")[0].attributes[0].nodeValue;
				var videoURL = entry.getElementsByTagName("id")[0].childNodes[0].nodeValue;
				console.log(entry.getElementsByTagName("content"));
				var description = "none";
				if (entry.getElementsByTagName("content")[0].childNodes.length > 0){
				var description = entry.getElementsByTagName("content")[0].childNodes[0].nodeValue;
				}
				var videoID = videoURL.split("/")[videoURL.split("/").length-1];
				
				videoURL = "http://www.youtube.com/embed/"+videoID;
				//console.dir(videosActivity);
				//var arr = videoURL.split("/");				
				//var videoID = arr[arr.length-1];		
				
				if (videosActivity[videoID]!=undefined){
				console.log("activityID " + videosActivity[videoID].activityID);
				console.log("order " + videosActivity[videoID].order);
				activityModel.addVideo("World Bank",projectID,videosActivity[videoID].activityID,videoURL,title,thumbnail,description,videosActivity[videoID].order);
				}
				//ySEj2tf62t8,j1v7Rp1pBvU,WtX9y7anLpY
			  }

			//Remove Undefined Items
			//activityModel
			//alert(projectID);
			console.log(activityModel.get("f"));
			console.log(activityModel.get("f."+projectID));
			console.log("YoutubeController > loadYoutubeModel > end");
			//alert("IN YOUTUBECONTROLLER");
			appModel.get("app.flickrController").restructureActivitiesToArray(projectID);
			//appModel.get("app.flickrController").layoutGrid(0);




				
			};
			

		
	}