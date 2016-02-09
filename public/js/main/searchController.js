/**
 * Created by ryanpfister on 1/8/15.
 */


(function() {

	var app = angular.module("main");

	var searchController = function($scope, $stateParams, searchResults, imagePreview, $timeout) {
		$scope.noWellOverride = true;

		$scope.title = $stateParams.title;
		$scope.categoryIds = angular.fromJson($stateParams.categoryIds);
		$scope.categoryNames = angular.fromJson($stateParams.categoryNames);
		$scope.distance = $stateParams.distance;
		$scope.location = $stateParams.location;

		var map;
		var mobileMap;
		var circles = {};
		var mobileMapInitialized = false;

		$("#dynamicSearchButton").show();
		$(".container").removeClass("container").addClass("container-fluid");
		$scope.$on("$destroy", function(){
			$("#dynamicSearchButton").hide();
			$(".container-fluid").removeClass("container-fluid").addClass("container");
		});

		$("#searchResultsUl").on("mouseenter", ".searchResultsItem", function (e) {
			if(circles) {
				var itemid = $(e.currentTarget).attr("data-itemid");
				map.panTo(circles[itemid].center);
				circles[itemid].infoWindow.open(map);
			}
		});

		$("#searchResultsUl").on("mouseleave", ".searchResultsItem", function (e) {
			if(circles) {
				var itemid = $(e.currentTarget).attr("data-itemid");
				circles[itemid].infoWindow.close();
			}
		});

		$scope.getImagePreview = function(item){
			return imagePreview(item, null, "small");
		};

		searchResults.performSearch({
			title: $stateParams.title,
			categoryIds: $scope.categoryIds,
			categoryNames: $scope.categoryNames,
			distance: parseInt($stateParams.distance),
			location: $stateParams.location
		}).then(function(data){
			$scope.items = data;
			$scope.$apply();
			initializeMap(data);

		}).fail(function(err){
			console.error(err);
		});

		$scope.getSelectedClass = function(item){
			if($scope.selectedSearchItem && item._id == $scope.selectedSearchItem){
				return "selected";
			}

			return "";
		};

		var leftColumn = $("#searchResultsLeft");
		var rightColumn = $("#searchResultsRight");
		var mapContainer = $("#bobResultMap");
		var $window = $( window );
		$window.resize(_.debounce(resizeMap, 250));

		$scope.initializeMobileMap = function(item){
			$scope.currentMapTitle = item.title;

			$timeout(function(){
				var itemCenter = new google.maps.LatLng(item.geolocation[1], item.geolocation[0]);

				mobileMap = new google.maps.Map(document.getElementById('mobileMap'), {
					center: itemCenter,
					draggable: true,
					disableDefaultUI: true,
					zoom: 13
				});

				var cityCircle = new google.maps.Circle(initializeCircle(mobileMap, item, itemCenter, null));
			}, 500);
		};

		function resizeMap() {
			var leftWidth = rightColumn.offset().left;
			var windowWidth = $window.width();
			var rightOffset = rightColumn.offset();
			mapContainer.css({
				'width': windowWidth - leftWidth,
				'height': $window.height() - rightOffset.top
			});

			if(windowWidth > 767){
				leftColumn.css({
					'height': $window.height() - rightOffset.top
				});
			}
			else{
				leftColumn.css({
					'height': ''
				});
			}
		}

		resizeMap();

		function initializeMap(items) {

			var bound = new google.maps.LatLngBounds();

			_.each(items, function(item){
				bound.extend( new google.maps.LatLng(item.geolocation[1], item.geolocation[0]) );
			});


			map = new google.maps.Map(document.getElementById('bobResultMap'));

			map.fitBounds(bound);

			$timeout(function(){

				if(map.getZoom() > 13 || map.getZoom() < 4) {
					map.setZoom(11);
				}
			}, 500);

			_.each(items, function(item){
				var itemCenter = new google.maps.LatLng(item.geolocation[1], item.geolocation[0]);
				var infowindow = new google.maps.InfoWindow({
					content: item.title,
					maxWidth: 200,
					position: itemCenter
				});

				circles[item._id] = initializeCircle(map, item, itemCenter, infowindow);

				// Add the circle for this city to the map.
				var cityCircle = new google.maps.Circle(circles[item._id]);

				var scrollParent = $("#searchResultsLeft");
				google.maps.event.addListener(cityCircle, 'click', function(mouseEvent) {
					$scope.selectedSearchItem = this.item._id;
					$scope.$apply();

					scrollParent.animate({
						scrollTop:  $("#searchResult" + this.item._id).position().top
					});
				});

				google.maps.event.addListener(map, 'zoom_changed', function(){
					console.log(map.getZoom());
				});


			});
		}

		function initializeCircle(map, item, itemCenter, infoWindow){
			return {
				strokeColor: '#FF0000',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#FF0000',
				fillOpacity: 0.35,
				map: map,
				center: itemCenter,
				radius: Math.sqrt(3) * 450,
				item: item,
				infoWindow: infoWindow
			};
		}


	};

	app.controller("searchController", searchController);

}());