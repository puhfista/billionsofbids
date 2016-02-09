/**
 * Created by ryanpfister on 3/24/15.
 */


angular.module('main').
	directive('onlyDigits', function () {

		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ngModel) {
				if (!ngModel) return;
				ngModel.$parsers.unshift(function (inputValue) {
					var digits = inputValue.split('').filter(function (s) { return (!isNaN(s) && s != ' '); }).join('');
					ngModel.$viewValue = digits;
					ngModel.$render();
					return digits;
				});
			}
		};
	});