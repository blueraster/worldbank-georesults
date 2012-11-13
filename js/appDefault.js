var appDefault = (function () {
	var _self = this;
	// private attribute object
	var config = {
	homeTitle: "Georesults (beta)",
	homeDescription: "Georesults (beta) helps us enhance transparency in World Bank-financed activities and helps you explore a project from a local perspective. Georesults is an online space to view images, videos and results stories of World Bank projects. It allows you to easily orient yourself using maps to guide your navigation. Choose a location and explore the work being done there and find out what results are being achieved. ",
	webmapURL: "http://www.arcgis.com/sharing/content/items/",
	webmap:"ed30a3365730440087839ff7812f394d",
	flickrKey:"e16226713f6de9a159f258f34bd5f9d9",
	flickrURL:"http://api.flickr.com/services/rest/?text=&user_id=[USER]&method=flickr.photosets.getPhotos&api_key=[KEY]&photoset_id=[PHOTOSET]&extras=description,machine_tags,url_sq,url_m&format=json&per_page=[PER_PAGE]",
	flickrUsers:[{user:"80983953@N04",photoset:"72157631791896998"}
				 //,{user:"88400943@N06",photoset:"72157631943420006"}
				],
	flickrPerPage:100,
	//webmap:"ef142e41896f4362ac7fb51562067f8d",	
	title: "Story Maps",
	subTitle: "World Bank",
	logo:"images/world-bank-logo.jpg",
	zoomLevel:7,
	projectsCSV:"config/projects.csv",
	activitiesFolder:"config/activity_",
	defaultBasemap:"basemap_7",
	countriesURL:"http://ags10.blueraster.net/ArcGIS/rest/services/WRI/CountryBoundaries/MapServer/0",
	basemapURL:"http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
	projectFillColor : [97,196,25,1.0],
	projectBorderColor : [255,255,255],
	projectBorderWidth : 2,
	textSymbolColor: [0,0,0],
	textSymbolSize: "9pt",
	textOffsetX: -1,
	textOffsetY: -4,
	noProjectsMessage:"<div style='text-align:center'>No projects found</div>"
	}

	var map = {
	logo: true,
	navigationMode:"css-transforms",//classic
	fadeOnZoom:true,
	lods:[ 
		//{"level":0,"resolution":156543.033928,"scale":591657527.591555},
		//{"level":1,"resolution":78271.5169639999,"scale":295828763.795777},
		{"level":2,"resolution":39135.7584820001,"scale":147914381.897889},
		{"level":3,"resolution":19567.8792409999,"scale":73957190.948944},
		{"level":4,"resolution":9783.93962049996,"scale":36978595.474472},
		{"level":5,"resolution":4891.96981024998,"scale":18489297.737236},
		{"level":6,"resolution":2445.98490512499,"scale":9244648.868618},
		{"level":7,"resolution":1222.99245256249,"scale":4622324.434309},
		{"level":8,"resolution":611.49622628138,"scale":2311162.217155},
		{"level":9,"resolution":305.748113140558,"scale":1155581.108577},
		{"level":10,"resolution":152.874056570411,"scale":577790.554289},
		{"level":11,"resolution":76.4370282850732,"scale":288895.277144},
		{"level":12,"resolution":38.2185141425366,"scale":144447.638572},
		{"level":13,"resolution":19.1092570712683,"scale":72223.819286},
		{"level":14,"resolution":9.55462853563415,"scale":36111.909643},
		{"level":15,"resolution":4.77731426794937,"scale":18055.954822}
		]
		//{"level":16,"resolution":2.38865713397468,"scale":9027.977411},
		//{"level":17,"resolution":1.19432856685505,"scale":4513.988705},
		//{"level":18,"resolution":0.597164283559817,"scale":2256.994353},
		//{"level":19,"resolution":0.298582141647617,"scale":1128.497176}];	
	}
	
	return {	

		// access the private members
		get:function (name) {
			return eval(name);	
			}
	}
})(); // the parens here cause the anonymous function to execute and return
