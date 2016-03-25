angular.module('application.routing', [])
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
    .state('main', {
        url: '/main',
        templateUrl: './app/views/main.html',
        controller: 'mainCtrl'
    })
    .state('login', {
        url: '/login',
        templateUrl: './app/views/login.html',
        controller: 'loginCtrl'
    })
    .state('search', {
        url: '/search',
        templateUrl: './app/views/search.html',
        controller: 'searchCtrl'
    })
    .state('details', {
        url: '/details',
        templateUrl: './app/views/details.html',
        controller: 'detailsCtrl'
    })
    .state('applicationsettings', {
        url: '/appsetting',
        templateUrl: './app/views/applicationsettings.html',
        controller: 'applicationSettingsCtrl'
    })
}]);
