var activityModel = (function () {
	
	// private attribute object
	var f = [];
	var activityByPosition = [];
	var activitiesList = [];
	var beforeAfterImages = [];
	
	return {
	
	clearBeforeAfterImages: function(){
		beforeAfterImages = new Array();
		},//end clearBeforeAfterImages
	
	get:function (name) {		
		return eval(name);	
		},//end get
		
		
	set:function(projectID, activityID,name,value) {
			var path = projectID + "." + activityID + "." + name;
			dojo.setObject(path,value,f);
		},//end set
		
		
	addBeforeAfterImage:function (flickrID,flickrOwner,projectID,activityID,smallPic,squarePic,mediumPic,mediumH,mediumW,description, position, place,isDefault,order) {	

		activityID = activityID || "A0";
		
		var imageObj = {position:  position, projectID: projectID, activityID:  activityID, order: order, flickrID: flickrID, flickrOwner: flickrOwner, image : squarePic, smallimage : smallPic, mediumImage : mediumPic, mediumH: mediumH, mediumW: mediumW, description: description, place: place, isDefault: isDefault};		
		if (!beforeAfterImages[projectID]){
			beforeAfterImages[projectID] = [];
		}
		dojo.getObject(projectID,true,f).hasBeforeAfter = true;
		beforeAfterImages[projectID].push(imageObj);

		//console.log("ACTIVITY " + activityID);
		//console.log("POSITION " + position);
		},//addBeforeAfterImage end
		
	arrangeBeforeAfter: function(pid){
		//alert(pid);
		var beforeAfterGroup = [];
		dojo.forEach(beforeAfterImages[pid],function(item){			
			//console.log("item.place " + item.place);			
			var order = item.order;
			//console.log("order " + order);
			//console.log("item.activityID " + item.activityID);
			
			if (!beforeAfterGroup[item.activityID]){
			beforeAfterGroup[item.activityID] = [];
			}
			
			if (!beforeAfterGroup[item.activityID][item.position]){
			beforeAfterGroup[item.activityID][item.position] = [];
			}
				//console.log(item.place);
				if (item.place=="first") {
				beforeAfterGroup[item.activityID][item.position].unshift(item);
				//console.log(beforeAfterGroup[item.activityID][item.position].length);
				//console.log("item.place " + item.place);
				} else {
				beforeAfterGroup[item.activityID][item.position].push(item);
				//console.log(beforeAfterGroup[item.activityID][item.position].length);
				//console.log("item.place " + item.place);
				}		
			
		});
		
		for (var activityID in beforeAfterGroup){
			//console.log(activityID);
			dojo.forEach(beforeAfterGroup[activityID],function(set){
			
			if (set!=undefined){
				var path = set[0].projectID + "." + set[0].activityID + "." + "media";
				if (!dojo.exists(path,f)){
						dojo.setObject(path,new Array(),f);				
						//dojo.getObject(set[0].projectID,true,f).flickrLoaded = true;
				}
				
				dojo.getObject(set[0].projectID,true,f).flickrLoaded = true;
				//console.dir(beforeAfterGroup);
				var activityObj = set;
				//console.log("ORDER");
				//console.log(set[0].order);
				if (set[0].order==0){
					dojo.getObject(path,false,f).push(activityObj);
				} 
				else
				{
					if (dojo.getObject(path,false,f)[set[0].order-1]!=undefined){
					dojo.getObject(path,false,f).splice(set[0].order-1,0,activityObj);
					} else {
					dojo.getObject(path,false,f)[set[0].order-1] = activityObj;
					}
				}
			}//end IF
			});//end FOReach
		}//end FOR
		//console.log("BREAK");
		//console.dir(beforeAfterGroup);
		//console.dir(f);

		},//end arrangeBeforeAfter
		
	addImage:function (flickrID,flickrOwner,projectID,activityID,smallPic,squarePic,mediumPic,mediumH,mediumW,description, isDefault, order) {	
		
		activityID = activityID || "A0";
		//console.log("activityID " + activityID);
		
		var path = projectID + "." + activityID + "." + "media";
		//console.log("f."+path);
		//console.log(dojo.exists("f."+path));
		if (!dojo.exists(path,f)){
		dojo.setObject(path,new Array(),f);		
		}
		dojo.getObject(projectID,true,f).flickrLoaded = true;
		var activityObj = {type:"imagesingle", flickrID: flickrID,flickrOwner: flickrOwner, image : squarePic, smallimage : smallPic, mediumImage : mediumPic, mediumH: mediumH, mediumW: mediumW, description: description, isDefault: isDefault, order:order};
			if (order==0){
			dojo.getObject(path,false,f).push(activityObj);
			} else
			{
				if (dojo.getObject(path,false,f)[order-1]!=undefined){
				dojo.getObject(path,false,f).splice(order-1,0,activityObj);
				} else {
				dojo.getObject(path,false,f)[order-1] = activityObj;
				}
			}
		},//end addImage
		
		
		addVideo:function (owner,projectID,activityID,videoURL,title,thumbnail,description,order) {	
		console.dir(arguments);
		//console.log("video added");
		//console.log(projectID);
		activityID = activityID || "A0";
		//console.log("activityID " + activityID);
		
		var path = projectID + "." + activityID + "." + "media";
		//console.log("f."+path);
		//console.log(dojo.exists("f."+path));
		if (!dojo.exists(path,f)){
		dojo.setObject(path,new Array(),f);		
		}
		dojo.getObject(projectID,true,f).youtubeLoaded = true;
		var activityObj = {type:"video", owner: owner, videoURL: videoURL, title:title, thumbnail:thumbnail, description: description};
		if (order==0){
		dojo.getObject(path,false,f).push(activityObj);
		} else
		{
			if (dojo.getObject(path,false,f)[order-1]!=undefined){
			dojo.getObject(path,false,f).splice(order-1,0,activityObj);
			} else {
			dojo.getObject(path,false,f)[order-1] = activityObj;
			}
		}		

		},//end addVideo
		
		
		setUniqueIdPosition:function(uniqueID){		
		activityByPosition.push(uniqueID);
		},
		getUniqueIdPosition:function(uniqueID){
		for (i=0;i<activityByPosition.length;i++){
		if (activityByPosition[i]==uniqueID)
			{
			return i+1;
			}
		}
		return activityByPosition[position];
		},
		getUniqueIdByPosition:function(position){
			return activityByPosition[position-1];
		},
		clearActivity:function(){
			activityByPosition = [];
		},
		addActivityList:function(uniqueID){
		activitiesList.push(uniqueID);
		},
		getActivityList:function(){
		return activitiesList;
		}
		/*deleteActivityList:function(uniqueID){
		activitiesList.push(uniqueID);
		}*/

	}
})(); 
