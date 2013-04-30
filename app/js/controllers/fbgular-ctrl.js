angular.module('myApp').controller('FBgular', ['$scope', '$location', 'FBService', 'ErrorMessageService',
    function ($scope, $location, FBService, ErrorMessageService) {
        'use strict';

        $scope.feed = [];
        $scope.gridOptions = {data: 'feed'};


        $scope.login = function () {

            FBService.getLoggedUser(
                function (user) {
                    $location.path('/fbgular');
                    $scope.$apply(); //angular issues see: http://stackoverflow.com/questions/11784656/angularjs-location-not-changing-the-path
                },
                function (error) {
                    ErrorMessageService.showError(error);
                });
        };

        $scope.getLoggedUser = function () {
            return FBService.getCachedUserData();
        };

        $scope.getFeed = function () {
            var cache = FBService.getCachedFeed();

            if (angular.isUndefined(cache))
                return [];

            if (angular.isArray(cache)) {

                if (cache.length > 0)
                    return cache;

                if (cache.length === 0) {
                    FBService.getUserFeed(function () {
                        $scope.$digest()
                    }, function (error) {
                        ErrorMessageService.showError(error)
                    });
                }
            }
        }
        ;

        function extractGridColumnData(fbFeed) {
            var gridData = [];

            if (angular.isUndefined(fbFeed))
                return gridData;

            $.each(fbFeed, function (index, fbPost) {
                var item =
                {
                    from: fbPost.from.name,
                    story: FBService.extractPostStory(fbPost)
                }
                gridData.push(item);
            });

            return gridData;
        }

        $scope.$watch('getFeed()', function (newValue, oldValue) {

            if (angular.equals(newValue, oldValue))
                return;

            if (angular.isUndefined(newValue))
                return;

            $scope.feed = extractGridColumnData(newValue);
        });


        $scope.feed = extractGridColumnData($scope.getFeed());

    }
])
;