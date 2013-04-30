'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['ngGrid','myApp.services']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'FBgular'});
        $routeProvider.when('/fbgular', {templateUrl: 'partials/mainView.html', controller: 'FBgular'});
        $routeProvider.when('/analysis', {templateUrl: 'partials/analysis.html', controller: 'AnalysisCtrl'});
        $routeProvider.otherwise({redirectTo: '/login'});
    }]);
