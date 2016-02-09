/**
 * Created by ryanpfister on 1/8/15.
 */

(function(){

	window.console = window.console || {"log":function(){}, "error":function(){}};

	Number.prototype.format = function(n, x) {
		var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
		return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
	};

	var app = angular.module("main", ["ui.router", 'ui.select', 'ngSanitize', "ngFileUpload", 'ngAnimate', 'smoothScroll', 'images', 'angularLoad', 'mgcrea.ngStrap']);

	var imagePreviewUrl = "//res.cloudinary.com/kaarta/image/upload";
	app.constant('imagePreviewUrl', imagePreviewUrl);
	app.constant('thumbnailUrl', imagePreviewUrl + "/c_pad,h_170,w_170/");

	app.directive('ngEnter', function () {
		return function (scope, element, attrs) {
			element.bind("keydown keypress", function (event) {
				if(event.which === 13) {
					scope.$apply(function (){
						scope.$eval(attrs.ngEnter);
					});

					event.preventDefault();
				}
			});
		};
	});

	app.filter('propsFilter', function() {
		return function(items, props) {
			var out = [];

			if (angular.isArray(items)) {
				items.forEach(function(item) {
					var itemMatches = false;

					var keys = Object.keys(props);
					for (var i = 0; i < keys.length; i++) {
						var prop = keys[i];
						var text = props[prop].toLowerCase();
						if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
							itemMatches = true;
							break;
						}
					}

					if (itemMatches) {
						out.push(item);
					}
				});
			} else {
				// Let the output be the input untouched
				out = items;
			}

			return out;
		};
	});

	app.factory('authHttpResponseInterceptor', ['$q', '$injector', function($q, $injector) {
		return {
			response: function(response){
				if (response.status === 401) {
				}

				return response || $q.when(response);
			},
			responseError: function(rejection) {
				if (rejection.status === 401) {
					var authService = $injector.get('authService');
					authService.redirectToLogin();
					return;
				}
				return $q.reject(rejection);
			}
		};
	}]).config(function($urlRouterProvider, $stateProvider, $locationProvider, $httpProvider){

		$locationProvider.html5Mode(true);

		$stateProvider
			.state("main", {
				url:'/',
				templateUrl: "/html/main/index.html",
				controller: "indexController"
			})
			.state("searchResults", {
				url: "/search/categoryNames/:categoryNames/categoryIds/:categoryIds/distance/:distance/location/:location",
				templateUrl: "/html/main/searchResults.html",
				controller: "searchController"
			})
			.state("itemDetails", {
				url: "/details/:itemId",
				templateUrl: "/html/main/itemDetails.html",
				controller: "itemDetailsController"
			})
			.state("listItem", {
				url: "/listItem",
				templateUrl: "/html/main/listItem.html",
				controller: "listItemController",
				onEnter: function(authService){
					if(!authService.isAuthenticated()){
						authService.redirectToLogin();
					}
				}
			})
			.state("editItem", {
				url: "/editItem/:itemId",
				templateUrl: "/html/main/listItem.html",
				controller: "editItemController",
				onEnter: function(authService){
					if(!authService.isAuthenticated()){
						authService.redirectToLogin();
					}
				}
			})
			.state("myItems", {
				url: "/myItems",
				templateUrl: "/html/main/myItems.html",
				controller: "myItemsController",
				onEnter: function(authService){
					if(!authService.isAuthenticated()){
						authService.redirectToLogin();
					}
				}
			})
			.state("itemBids", {
				url: "/itemBids/:itemId",
				templateUrl: "/html/main/itemBids.html",
				controller: "itemBidsController",
				onEnter: function(authService){
					if(!authService.isAuthenticated()){
						authService.redirectToLogin();
					}
				}
			})
			.state("messages", {
				url: "/messages",
				templateUrl: "/html/main/messages.html",
				controller: "messagesController",
				onEnter: function(authService){
					if(!authService.isAuthenticated()){
						authService.redirectToLogin();
					}
				}
			})
			.state("conversation", {
				url: "/conversation/:otherUserId",
				templateUrl: "/html/main/conversation.html",
				controller: "conversationController",
				onEnter: function(authService){
					if(!authService.isAuthenticated()){
						authService.redirectToLogin();
					}
				}
			})
			.state("notifications", {
				url: "/notifications",
				templateUrl: "/html/main/itemDetails.html",
				controller: "itemDetailsController",
				onEnter: function(authService){
					if(!authService.isAuthenticated()){
						authService.redirectToLogin();
					}
				}
			});

		$urlRouterProvider.otherwise('/');

		$httpProvider.interceptors.push('authHttpResponseInterceptor');
	});

	$(function(){
		$('body').vegas({
			slides: [
				{ src: '/img/road_forest.jpg' }
			]
		});
	});

}());