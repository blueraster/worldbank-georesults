var webmapModel = (function () {
	var data= [];
	// private attribute object
	data.projects = [];
	data.activities = [];
	data.countries = [];
		
	return {	
		get:function (item) {		
			return data[item];	
			},
		
		set:function (countries,projects,activities) {	
			data.countries = countries;
			data.projects = projects;
			data.activities = activities;
		}
	}
})(); 
