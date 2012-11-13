//singleton example
var FlickrLoader = (function () {

		function Singleton(options) {
		// set options to the options supplied or an empty object if none provided.
		options = options || {};	

		var that = this;
		var totalFlickrUsers = appDefault.get("config").flickrUsers.length;
	
		var usersLoaded = [];
		
		
		var allPhotos = [];		
		//var flickrUsers = appDefault.get("config").flickrUsers;
		var flickrPerPage = appDefault.get("config").flickrPerPage;
		var currentFlickrUserPages = [];
		dojo.forEach(appDefault.get("config").flickrUsers,function(flickrUser){
			currentFlickrUserPages[flickrUser.photoset.toString()] = [];			
		});
		//console.log(currentFlickrUserPages);


		//var currentFlickrUser = flickrUsers[0];

		this.callFlickr = function(flickrUser,pageNum){
			//dojo.forEach(flickrUsers,function(flickrUser){
			var pageNum = pageNum || 1;
			
			console.log("projectsFlickrLoader >> loadFlickr");		
			var ID = "wb:defaultproject=1";
			var url = appDefault.get("config").flickrURL;
			
			url = url.replace("[USER]",flickrUser.user);
			url = url.replace("[PHOTOSET]",flickrUser.photoset);
			url = url.replace("[KEY]",appDefault.get("config").flickrKey);	
			url = url.replace("[PER_PAGE]",flickrPerPage);	
			url = url + "&page="+pageNum.toString();
			
			//alert(url);
			var flickrRequest = url;
			//console.log(flickrRequest);
			        var requestHandle = esri.request({
					  url: flickrRequest,
					  callbackParamName: "jsoncallback",
					  load: dojo.partial(that.handleFlickrResponse,flickrUser),
					  error: fetchFailed
					}, {
					  useProxy: false
					});
			

			   // });//ForEach
			}//callFlickr
		

		 // Callback for processing a returned list of items.
		this.handleFlickrResponse = function(flickrUser,response,io){
			var owner = response.photoset.owner;
			
			
			//photos.push({})
			

			
			
			if (currentFlickrUserPages[flickrUser.photoset].currentPage==undefined){
				currentFlickrUserPages[flickrUser.photoset].currentPage = 1;
				currentFlickrUserPages[flickrUser.photoset].totalPages = parseInt(response.photoset.pages);
				currentFlickrUserPages[flickrUser.photoset].photos = [];

			} else {
				currentFlickrUserPages[flickrUser.photoset].currentPage++;				
			}

			var currentPage = currentFlickrUserPages[flickrUser.photoset].currentPage;
			var totalPages = currentFlickrUserPages[flickrUser.photoset].totalPages;

			//console.log(photos.length);
			//console.log(" totalPages " + totalPages);
			//console.log(" totalPages " + currentFlickrUserPages[flickrUser.name].totalpages);
			//console.log(" currentPage " + currentPage);
			//console.log(" user " + flickrUser.photoset);

			
			
			console.log("flickr respone");
			//console.log(response);
			//appModel.set("flickrResponse",response.photoset.photo);

			if ((currentPage==1) && (totalPages>1)){	//call remaining pages parallelly				
				//that.callFlickr(currentFlickrUser.currentPage+1);

				var i = currentPage+1;
				for(i;i<=totalPages;i++){			
				that.callFlickr(flickrUser,i);
				}
				
			}	

		
			
			var photos = currentFlickrUserPages[flickrUser.photoset].photos;
			photos.push.apply(photos,response.photoset.photo);
			allPhotos.push.apply(allPhotos,response.photoset.photo);
			
			

			if (currentPage==totalPages){

				
				usersLoaded.push(flickrUser.name);
				dojo.publish(Events.loadActivityModel,[photos, flickrUser.user]);	//Now use the photos to load Activity Model, FlickrController
				
			}

		


			if (usersLoaded.length==totalFlickrUsers){//publish results	
				
				//console.log("Grand Total " + photos.length);		
				dojo.publish(Events.setProjectDefaultImages,[allPhotos, io]);	//set default images for Project, ProjectsController
				
				
				//alert(response.photoset.owner);				
			}	



		 }
		 
			 // Callback for if the lookup fails.
		 function fetchFailed(error, request){
		   alert("lookup failed.");
		 }
	 

		
		
				
		}
		
		// this is our instance holder
		var instance;
		
		// this is an emulation of static variables and methods		
		var _static = {
			name: 'projectsModel',
			// This is a method for getting an instance
			// It returns a singleton instance of a singleton object
			getInstance: function (options) {
			if (instance === undefined) {
			instance = new Singleton(options);
			}
			return instance;
			}
		};
		
		return _static;
		
		})();
		
