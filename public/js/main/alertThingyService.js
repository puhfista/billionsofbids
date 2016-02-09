/**
 * Created by ryan on 3/23/15.
 */


angular.module('main')
    .service('alertThingy', function ($timeout, $rootScope) {
        return function(stuff){
            $rootScope.alertThingyTop = stuff.top;
            $rootScope.alertThingyLeft = stuff.left;
            $rootScope.alertThingyMessage = stuff.message;
            $rootScope.alertThingyShow = true;
            $rootScope.alertThingyStyle = {
                top: (stuff.top - 200) + "px",
                left: stuff.left + "px",
                display: "block",
                width: "300px"
            };

            $timeout(function(){
                $rootScope.alertThingyShow = false;
            }, stuff.timeout || 2000);

        }
    });