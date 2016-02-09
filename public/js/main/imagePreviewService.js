/**
 * Created by ryanpfister on 3/24/15.
 */

var module = angular.module('images', []);


angular.module('images')
	.service('imagePreview', function (imagePreviewUrl) {

		var sizes = {

			small: {
				width: 100,
				height: 60
			},

			medium: {
				width: 350,
				height: 350
			},

			large:{
				width: 400,
				height: 400
			}

		};

		return function(item, image, requestedSize){

			if(item.images.length == 0){
				return "/img/noImagePlaceholder.png";
			}

			var size = sizes[requestedSize || "small"];

			return imagePreviewUrl + "/c_pad,h_" + size.height + ",w_" + size.width + "/" + (image || item.images[0]) + ".png";

		};
	});