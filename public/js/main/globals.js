/**
 * Created by ryanpfister on 3/13/15.
 */

var app = angular.module("main");

app.run(function($rootScope, $location) {
	$rootScope.getRelativePath = function() {
		return encodeURIComponent($location.path());
	};
});