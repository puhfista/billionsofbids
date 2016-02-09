/**
 * Created by ryanpfister on 5/6/15.
 */

angular.module('main')
	.service('imageUpload', function ($upload, $timeout, $http) {

		var images = [];
		var buttonSpinner;

		var onImageUploaded;
		var onImageDeleted;

		this.deleteImage = function(imageData, userId, itemId){
			$http.post("/image/delete", {
				itemId: itemId,
				userId: userId,
				imageId: imageData.public_id
			}).success(function(data){
				images = _.filter(images, function(img){
					return img.public_id != imageData.public_id;
				});

				if(onImageDeleted){
					onImageDeleted(data);
				}
			}).error(function(err){

			});
		};

		this.subscribeImageUploaded = function(eventHandler){
			onImageUploaded = eventHandler;
		};

		this.subscribeImageDeleted = function(eventHandler){
			onImageDeleted = eventHandler;
		};

		this.setButtonSpinner = function(btnSpner){
			buttonSpinner = btnSpner;
		};

		this.getImages = function(){
			return images;
		};

		this.setImages = function(alreadyUploadedImages){
			images = alreadyUploadedImages;
		};

		this.watchFiles = function(files) {
			if (files != null) {
				buttonSpinner.start();
				for (var i = 0; i < files.length; i++) {
					(function(file) {
						uploadUsing$upload(file);
					})(files[i]);
				}
			}
		};

		function uploadUsing$upload(file) {
			file.upload = $upload.upload({
				url: '/image/upload',
				method: 'POST',
				headers: {
					'is-it-real' : 'dis-is-real'
				},
				fields: {what: "whoKnows"},
				file: file,
				fileFormDataName: 'disImages'
			});

			file.upload.then(function(response) {
				$timeout(function() {
					if(onImageUploaded)
						onImageUploaded(response.data);
					images.push(response.data);

					buttonSpinner.stop();
				});
			}, function(response) {
				if (response.status > 0)
					throw new Error(response.status + ': ' + response.data);
			});

			file.upload.progress(function(evt) {
				// Math.min is to fix IE which reports 200% sometimes
				file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			});

			file.upload.xhr(function(xhr) {
				// xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
			});
		}

	});