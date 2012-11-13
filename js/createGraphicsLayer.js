var createGraphicsLayer = function (options) {
//console.log("creating flayer");
this.id = options.mode;


var gLayer = new esri.layers.GraphicsLayer({id:this.id})
 
return gLayer;

}

