var createFeatureLayer = function (options) {
//console.log("creating flayer");
this.url = options.url;
this.where = options.where;
this.definitionQuery = options.definitionQuery;
this.mode = options.mode;
this.id = options.mode;


var fLayer = new esri.layers.FeatureLayer(this.url,{
autoGeneralize:true,
visible:true,
outField:["*"],
mode: esri.layers.FeatureLayer.MODE_SNAPSHOT
})
      dojo.connect(fLayer, "onLoad", function (layer) {
	   fLayer.setDefinitionExpression(where);
	});
return fLayer;

}

