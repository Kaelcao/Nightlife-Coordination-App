'use strict';

(function () {
    angular
        .module('app', [])
        .controller('mainController',
            ['$scope', '$http', function ($scope, $http) {
                $scope.search = "";
                $scope.locations = [];
                $scope.isLoading = false;

                $scope.searchLocations = function () {
                    $scope.isLoading = true;
                    $http.get("/api/search?location=" + $scope.search)
                        .then(
                            function (result) {
                                var locations = result.data;
                                if (!locations) {
                                    locations = [];
                                }
                                $http.get('/api/locations')
                                    .then(
                                        function (result) {
                                            $scope.locations = locations.map(function (location) {
                                                var temp = result.data;
                                                if (!location.count) {
                                                    location.count = 0;
                                                }
                                                for (var i = 0; i < temp.length; i++) {
                                                    if (temp[i].locationId == location.id) {
                                                        location.count += 1;
                                                    }
                                                }

                                                return location;
                                            });
                                            $scope.isLoading = false;
                                        }, function (err) {
                                            throw(err)
                                        });

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
