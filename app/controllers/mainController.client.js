'use strict';

(function () {
    angular
        .module('app', [])
        .controller('mainController',
            ['$scope', '$http', function ($scope, $http) {
                $scope.search = "San Francisco";
                $scope.locations = [];
                $scope.isLoading = false;

                $scope.searchLocations = function () {
                    $scope.isLoading = true;
                    $http.get("/api/search?location=" + $scope.search)
                        .then(
                            function (result) {
                                var locations = result.data;
                                $scope.locations = locations.map(function (location) {
                                    location.count = 0;
                                    return location;
                                });
                                $scope.isLoading = false;
                            },
                            function (err) {
                                if (err) throw (err);
                            });
                };
                var search = localStorage.getItem('search');
                if (search) {
                    $scope.search = search;
                    $scope.searchLocations();
                    localStorage.removeItem('search');
                }



                $scope.going = function (location) {
                    $http.get('/api/going?locationId=' + location.id)
                        .then(
                            function (result) {
                                var count = result.data.count;
                                if (count == 0) {
                                    localStorage.setItem('search', $scope.search);
                                    window.location = '/auth/twitter';
                                } else {
                                    location.count += count;
                                }
                            }, function (err) {
                                if (err) throw(err);
                            }
                        );
                }
            }]);
})();
