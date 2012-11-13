var projectModel = (function () {
	var data= [];
		
	return {	
		get:function (ISO3) {		
			return data[ISO3];	
			},
		
		add:function (ISO3,geometry) {	
			data[ISO3] = geometry
		}
	}
})(); 