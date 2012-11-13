var projectsGridModel = (function () {
	var data= [];
		
	return {	
		get:function () {		
			return data;	
			},
		getByProjectID:function (projectID) {	
			var pid = projectID.toUpperCase();		
			return data[projectID];	
			},
		//
		set:function (projectID,country,project,projecturl,projectlinkstext,projectlinksurl,description,iso3,zoomlevel,xmin,ymin,xmax,ymax) {	
			//console.log("gridModel projectlinksurl" + projectlinksurl);
			var pid = projectID.toUpperCase();
			data[pid] = [];
			data[pid].country = country;
			data[pid].project = project;
			data[pid].projecturl = projecturl;
			data[pid].projectlinkstext = projectlinkstext;
			data[pid].projectlinksurl = projectlinksurl;
			data[pid].description = description;
			data[pid].iso3 = iso3;			
			data[pid].id = pid;
			data[pid].zoomlevel = zoomlevel;
			data[pid].xmin = xmin;
			data[pid].ymin = ymin;
			data[pid].xmax = xmax;
			data[pid].ymax = ymax;
		},
		saveDefaultImage:function (projectID,squarePic) {	
			//console.log("set Image");
			//console.log(projectID);
			var pid = projectID.toUpperCase();
			if (data[pid]!=undefined){
			data[pid].image = squarePic;
			//console.log(pid);	
			//console.log(data[pid].image);			
			} else {
			//console.log(pid + " in Flickr but NOT in Projects CSV");
			}
		}
	}
})(); 
