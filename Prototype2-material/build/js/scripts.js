angular.module('app', [
    'ngMaterial',
    'ui.router'
])
.config(function($mdThemingProvider) {
    $mdThemingProvider
    .theme('default')
    .primaryPalette('indigo')
    .accentPalette('pink')
    .warnPalette('red')
    .backgroundPalette('blue-grey')
})
angular.module('app')
/**
 * Parent Controller
 */
    .controller('mainCtrl', ['$state', '$rootScope', 'AuthService', function($state, $rootScope, AuthService) {
        var vm = this,
            nw = require('nw.gui'),
            win = nw.Window.get();
        
        win.isMaximized = false;
        vm.isLoggedIn = false;

        // Navigate Back
        vm.navigateBack = function() {
            // upgrade this later to use some history service
            $state.go('search');
        }
        // Min
        vm.windowMinimize = function() {
            win.minimize();
        }
        // Max
        vm.windowMaximize = function() {
            if (win.isMaximized) {
                win.unmaximize();
            } else {
                win.maximize();
            }
        }
        // Close
        vm.windowClose = function() {
            win.close();
        }
        // Dev tools (Temporary)
        vm.openDevTools = function() {
            win.showDevTools();
        }
        vm.reloadPage = function() {
            win.reload();
        }

        // Watchers
        win.on('maximize', function() {
            win.isMaximized = true;
        });
        win.on('unmaximize', function() {
            win.isMaximized = false;
        });
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            console.log(fromState);
            console.log(toState);
            vm.isLoggedIn = AuthService.getIsLoggedIn()
        });
    }])
/**
 * Controller for Login Page
 */
    .controller('loginCtrl', ['$state', 'AuthService', function($state, AuthService) {
        var vm = this;
        vm.username = "";
        vm.password = "";
        
        vm.login = function() {
            AuthService.setIsLoggedIn(true);
            console.log(AuthService.getIsLoggedIn());
            $state.go('search');
        }
    }])
/**
 * Controller for Search Page
 */
    .controller('searchCtrl', ['$state', function($state) {
        var vm = this;
        vm.query = "";
        
        vm.search = function() {
            $state.go('details');
        }
    }])
    
    .controller('detailsCtrl', ['$state', function($state) {
        var vm = this;
        
        vm.citations = [
            {
                title: 'Vagrancy',
                text: 'some details'
            },
            {
                title: 'Racketeering',
                text: 'There are tons of details about this racketeering. lkajsfa lkajlf asfh hsdflk sjadfh j j k jladfkj sdkfasj dljal sjfsl jj sdf'
            },
            {
                title: 'Murder',
                text: 'murder details'
            },
            {
                title: 'Tax Evasion',
                text: 'details'
            },
            {
                title: 'Vagrancy',
                text: 'some details'
            },
            {
                title: 'Racketeering',
                text: 'There are tons of details about this racketeering. lkajsfa lkajlf asfh hsdflk sjadfh j j k jladfkj sdkfasj dljal sjfsl jj sdf'
            },
            {
                title: 'Murder',
                text: 'murder details'
            },
            {
                title: 'Tax Evasion',
                text: 'details'
            }
        ];
    }]);
angular.module('app')
.directive('labelContent', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            label: '@',
            content: '@'
        },
        templateUrl: 'build/templates/labelContent.tmpl.html'
    }
})
angular.module('app')
.factory('AuthService', function() {
    var _isLoggedIn;
    
    function setIsLoggedIn(val) {
        if(typeof(val) === "boolean") {
            _isLoggedIn = val;
        }
    }
    
    function getIsLoggedIn() {
        return _isLoggedIn;
    }
    
    return {
        setIsLoggedIn: setIsLoggedIn,
        getIsLoggedIn: getIsLoggedIn
    }
})
angular.module('app')
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('login');

        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "./build/views/login.html",
                controller: "loginCtrl as login"
            })
            .state('search', {
                url: "/search",
                templateUrl: "./build/views/search.html",
                controller: "searchCtrl as search"
            })
            .state('details', {
                url: "/details",
                templateUrl: "./build/views/details.html",
                controller: "detailsCtrl as details"
            })
    });