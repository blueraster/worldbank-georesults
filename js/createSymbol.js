var createSymbol = function (options) {
//console.log("creating flayer");
var type = options.type;
var size = options.size;
var borderColor = options.borderColor;
var borderWidth = options.borderWidth;
var fillColor = options.fillColor;
var symbol = "";

if (options.size<=3) {
size = 18;
}

if (options.size>3 && options.size<=6) {
size = 21;
}

if (options.size>6 && options.size<=10) {
size = 24;
}

if (options.size>10) {
size = 27;
}
//console.log(options.size);
switch (type) 
{
case "point":
	symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, size,
				new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color(borderColor), borderWidth),
												new dojo.Color(fillColor));
												
//this.symbol = new esri.symbol.PictureMarkerSymbol('images/Legend/map-marker.png',17,23);	 //observation_flag_inaturalist.png  27x27
												
}
return symbol;

}

