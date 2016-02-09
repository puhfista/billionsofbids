/**
 * Created by ryanpfister on 3/12/15.
 */


angular.module('main')
	.service('authService', function ($state, $window, $location) {


		function isAuthenticated(){
			return $("#loggedIn").length > 0;
		}

		function currentUserId(){
			return $("#loggedIn").val();
		}

		function redirectToLogin(){
			$window.location.href = "/login/" + encodeURIComponent($location.path());
		}

		return {
			isAuthenticated: isAuthenticated,
			redirectToLogin: redirectToLogin,
			currentUserId: currentUserId
		}

	});