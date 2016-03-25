angular.module('demoapp', [
    'ui.router',
    'ngAnimate',
    'components.window',
    'application.routing',
    'application.directives',
    'application.templates',
    'ui.bootstrap',
    'uiSwitch',
    'angular-velocity',
    'door3.css',
    'cfp.hotkeys',
    'pageslide-directive'
])

.run(['$window', '$rootScope', function ($window, $rootScope) {
    $rootScope.online = navigator.onLine;

    $window.addEventListener("offline", function () {
        $rootScope.$apply(function () {
            $rootScope.online = false;
        });
    }, false);
    $window.addEventListener("online", function () {
        $rootScope.$apply(function () {
            $rootScope.online = true;
        });
    }, false);
}]);

var server = require('../server/server');
var uuid = require('node-uuid');

angular.isUndefinedOrNull = function(val) {
    return angular.isUndefined(val) || val === null
}
angular.module('demoapp')
    .controller('cssBundleCtrl', ['$scope', '$css', function($scope, $css) {
        // set the default bootswatch name
        var dbtheme = server.appsettingsdb.loadTheme().then(function(theme) {
            localStorage.setItem('theme', theme);
        });
        $scope.css = localStorage.getItem('theme');

        // create the list of bootswatches
        $scope.bootstraps = [
            { name: 'Light (cosmo)', url: 'cosmo' },
            { name: 'Dark (darkly)', url: 'darkly' },
            { name: 'Material (paper)', url: 'paper' }
        ];

        $scope.CssCollection = [
            'css/material-design-color-palette.min.css',
            'lib/font-awesome/css/font-awesome.min.css',
            'lib/waves/waves.css',
            'css/booleanswitch.css',
            'lib/angular-ui-switch/switch.css',
            'lib/angular-hotkeys/build/hotkeys.css',
            'css/app.css'
        ];

        $scope.$watch('css', function(newval, oldval) {
            console.log('new css = ' + newval);
            if (newval == 'null') newval = 'darkly'; // default

            //remove old css collections
            $css.remove($scope.CssCollection);
            $css.remove([
                'css/bootstrap.darkly.min.css',
                'css/bootstrap.cosmo.min.css',
                'css/bootstrap.paper.min.css'
            ]);

            //prepare for new  css collections
            var newCssCollection = [];
            newCssCollection.push('css/bootstrap.' + newval + '.min.css');
            angular.forEach($scope.CssCollection, function(val) {
                newCssCollection.push(val);
            });
            //add new css collections
            $css.add(newCssCollection);
        })

        $scope.saveTheme = function(theme) {
            localStorage.setItem('theme', theme);
            server.appsettingsdb.saveTheme(theme).then(function(response) {
                if (response) {
                    var notification = new Notification('NW.JS eForms', {
                        icon: "icon32.png",
                        body: "Theme changed successfully to - " + theme
                    });
                    notification.onclick = function() {
                        console.log("theme - Notification clicked");
                    };
                    notification.onshow = function() {
                        console.log('Show');
                        setTimeout(function() { notification.close(); }, 1000);
                    };
                }
            });
        }
    }])


    .controller('indexCtrl', ['$scope', 'hotkeys', function($scope, hotkeys) {
        $scope.welcome = "nwjs-Demo";
        hotkeys.add({
            combo: 'shift+v',
            description: 'Create new VIN form',
            callback: function() { }
        });
    }])

    .controller('mainCtrl', ['$scope', '$state', 'hotkeys', function($scope, $state, hotkeys) {
        $scope.today = new Date();
        $scope.format = 'M/d/yy h:mm:ss a';


    }])

    .controller('applicationSettingsCtrl', ['$scope', 'hotkeys', function($scope, hotkeys) {
        //TODO: application settings related code.
    }])

    .controller('releaseNotesCtrl', ['$scope', function($scope) {
        //TODO: user settings related code.
    }])

    .controller('transferCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        $scope.checked = false;
        $scope.transferList = [];

        $scope.open = function() {
            $scope.finalizedForms = server.vindb.loadFinalizedForms();
            $scope.checked = !$scope.checked
        }

        $scope.transfer = function() {
            for (var i = 0; i < $scope.transferList.length; i++) {
                if ($scope.transferList[i]) {
                    server.remotedb.submitForm($scope.finalizedForms[i]);
                    server.vindb.markTransferred($scope.finalizedForms[i].formInfo.id);
                }
            }
        }

        $rootScope.$on('openTransferPanel', function(event, data) {
            $scope.open();
        });
    }])

    .controller('loginCtrl', ['$scope', '$state', function($scope, $state) {
        $scope.username = "";
        $scope.password = "";

        $scope.login = function() {
            isValid = true;
            if (isValid) {
                $state.go('search');
            }
        }
    }])

    .controller('searchCtrl', ['$scope', '$state', function($scope, $state) {
        $scope.searchQuery = "";

        $scope.search = function() {
            // do search
            $state.go('details')
        }
    }])

    .controller('detailsCtrl', ['$scope', '$state', function($scope, $state) {
        $scope.citations = [
            {
                title: 'Vagrancy',
                details: 'some details'
            },
            {
                title: 'Racketeering',
                details: 'There are tons of details about this racketeering. lkajsfa lkajlf asfh hsdflk sjadfh j j k jladfkj sdkfasj dljal sjfsl jj sdf'
            },
            {
                title: 'Murder',
                details: 'murder details'
            },
            {
                title: 'Tax Evasion',
                details: 'details'
            },
            {
                title: 'Vagrancy',
                details: 'some details'
            },
            {
                title: 'Racketeering',
                details: 'There are tons of details about this racketeering. lkajsfa lkajlf asfh hsdflk sjadfh j j k jladfkj sdkfasj dljal sjfsl jj sdf'
            },
            {
                title: 'Murder',
                details: 'murder details'
            },
            {
                title: 'Tax Evasion',
                details: 'details'
            }
        ];
        $scope.vehicleNotes = [
            "Driver side door have multiple bullet holes.",
            "Doors are armor plated.",
            "Windows are made of bulletproof glass.",
        ]
    }])
angular.module('application.directives', [])
.directive('newCard', function ($templateCache) {
    return {
        transclude: true,
        scope: {
            cardcolor: '@',
            cardtitle: '@',
            cardcontent: '@',
            cardaction: '@',
            // cardactionclick:'&'
        },
        restrict: 'E',
        //templateUrl: 'app/directive_tmpl/general/newcard.tmpl.html'
        template: $templateCache.get('newcard.tmpl.html')
    }
})

.directive('winresize', function ($window) {
    return function (scope, element, attr) {

        var w = angular.element($window);
        scope.$watch(function () {
            return {
                'h': window.innerHeight,
                'w': window.innerWidth
            };
        }, function (newValue, oldValue) {
            console.log(newValue, oldValue);
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.resizeWithOffset = function (offsetH) {
                scope.$eval(attr.notifier);
                return {
                    'height': (newValue.h - offsetH) + 'px'
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
})
.directive('wellCard', function ($templateCache) {
    return {
        transclude: true,
        scope: {
            label: '@',
            labelclass: '@',
            iconclass: '@',
            wellheader: '@',
            wellcontent: '@'
        },
        restrict: 'E',
        template: $templateCache.get('smallwell.tmpl.html')
        //templateUrl: 'app/directive_tmpl/general/smallwell.tmpl.html'
    }
})
.directive('uppercased', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (input) {
                return input ? input.toUpperCase() : "";
            });
            element.css("text-transform", "uppercase");
        }
    }
})
.directive('textboxWithLabel', function ($templateCache) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            label: '@',
            id: '@',
            placeholder: '@',
            ngMinlength: '=',
            ngMaxlength: '=',
            required: '@',
            ngModel: '=',
            ngModelOptions: '=',
            ngMinlengthErrType: '@',
            static: '@',
            type: '@'
        },
        //templateUrl: 'app/directive_tmpl/form_controls/textboxwithlabel.tmpl.html',
        template: $templateCache.get('textboxwithlabel.tmpl.html'),
        link: function (scope, element, attrs) {
            if (attrs.required === undefined) {
                attrs.required = false;
            }
            if (attrs.static === undefined) {
                attrs.static = false;
            }
        }
    }
})
.directive('dropdownWithLabel', function ($templateCache) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            label: '@',
            id: '@',
            items: '=',
            ngModel: '=',
            required: '@'
        },
        //templateUrl: 'app/directive_tmpl/form_controls/dropdownwithlabel.tmpl.html',
        template: $templateCache.get('dropdownwithlabel.tmpl.html'),
        link: function (scope, element, attrs) {
            if (attrs.required === undefined) {
                attrs.required = false;
            }
        }
    }
})
.directive('switchWithLabel', function ($templateCache) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            label: '@',
            id: '@',
            on: '@',
            off: '@',
            required: '@',
            ngModel: '='
        },
        //templateUrl: 'app/directive_tmpl/form_controls/switchwithlabel.tmpl.html',
        template: $templateCache.get('switchwithlabel.tmpl.html'),
        link: function (scope, element, attrs) {
            if (attrs.required === undefined) {
                attrs.required = false;
            }
        }
    }
})
.directive('sortableTab', function ($timeout, $document) {
    return {
        link: function (scope, element, attrs, controller) {
            // Attempt to integrate with ngRepeat
            // https://github.com/angular/angular.js/blob/master/src/ng/directive/ngRepeat.js#L211
            var match = attrs.ngRepeat.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
            var tabs;
            scope.$watch(match[2], function (newTabs) {
                tabs = newTabs;
            });

            var index = scope.$index;
            scope.$watch('$index', function (newIndex) {
                index = newIndex;
            });

            attrs.$set('draggable', true);

            // Wrapped in $apply so Angular reacts to changes
            var wrappedListeners = {
                // On item being dragged
                dragstart: function (e) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.dropEffect = 'move';
                    e.dataTransfer.setData('application/json', index);
                    element.addClass('dragging');
                },
                dragend: function (e) {
                    //e.stopPropagation();
                    element.removeClass('dragging');
                },

                // On item being dragged over / dropped onto
                dragenter: function (e) {
                },
                dragleave: function (e) {
                    element.removeClass('hover');
                },
                drop: function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var sourceIndex = e.dataTransfer.getData('application/json');
                    move(sourceIndex, index);
                    element.removeClass('hover');
                }
            };

            // For performance purposes, do not
            // call $apply for these
            var unwrappedListeners = {
                dragover: function (e) {
                    e.preventDefault();
                    element.addClass('hover');
                },
                /* Use .hover instead of :hover. :hover doesn't play well with
                moving DOM from under mouse when hovered */
                mouseenter: function () {
                    element.addClass('hover');
                },
                mouseleave: function () {
                    element.removeClass('hover');
                }
            };

            angular.forEach(wrappedListeners, function (listener, event) {
                element.on(event, wrap(listener));
            });

            angular.forEach(unwrappedListeners, function (listener, event) {
                element.on(event, listener);
            });

            function wrap(fn) {
                return function (e) {
                    scope.$apply(function () {
                        fn(e);
                    });
                };
            }

            function move(fromIndex, toIndex) {
                // http://stackoverflow.com/a/7180095/1319998
                tabs.splice(toIndex, 0, tabs.splice(fromIndex, 1)[0]);
            };

        }
    }
})
.directive('myCurrentTime', ['$interval', 'dateFilter',
function ($interval, dateFilter) {
    return function (scope, element, attrs) {
        var format,  // date format
        stopTime; // so that we can cancel the time updates

        // used to update the UI
        function updateTime() {
            element.text(dateFilter(new Date(), format));
        }

        // watch the expression, and update the UI on change.
        scope.$watch(attrs.myCurrentTime, function (value) {
            format = value;
            updateTime();
        });

        stopTime = $interval(updateTime, 1000);

        // listen on DOM destroy (removal) event, and cancel the next UI update
        // to prevent updating time after the DOM element was removed.
        element.on('$destroy', function () {
            $interval.cancel(stopTime);
        });
    }
}]);

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

'use strict'

var gui = require('nw.gui');
var win = gui.Window.get(); // to get current window context.
var commands = gui.App.argv;

console.log('Commands - ');
console.log(commands);
var currentVersion = gui.App.manifest.version;
console.log('Version- ' + currentVersion);

angular.module('components.window',[])
.run(function($interval){
    //gui.App.setCrashDumpDir(dir);
    console.log('current exec path- ' + process.execPath)
    // Create a tray icon
    var tray = new gui.Tray({
        title: 'Tray',
        icon: '/public/images/Sync.png',
        tooltip:'eForms - nw.js'
    });
    // Give it a menu

    var developr = new gui.Menu({type:'menubar'});
    developr.append(new gui.MenuItem({
        label:'Check Versions',
        click:function(){
            alert(
                'Node.JS version - ' + process.versions['node'] + '\n' +
                'NodeWebkit version - ' + process.versions['node-webkit']
            );
        }
    }));
    developr.append(new gui.MenuItem({
        label:'Toggle Console Tools',
        click: function(){
            if(win.isDevToolsOpen())
            win.closeDevTools();
            else
            win.showDevTools();
        }
    }));
    developr.append(new gui.MenuItem({
        label:'Reload (same as toolbar reload)',
        click: function(){
            win.reloadDev();
        }
    }));
    developr.append(new gui.MenuItem({
        label:'Reload w/o Cache aka "Shift-Reload"',
        click: function(){
            win.reloadIgnoringCache();
        }
    }));
    developr.append(new gui.MenuItem({
        label:'Test update progress',
        click: function () {
            var promise, index = 1;
            win.setBadgeLabel(10 * 1);
            function start() {
                stop();
                promise = $interval(function () {
                    console.log('index:' + index);
                    if ((index * 10) > 100)
                        stop();
                    else {
                        index += 1;
                        console.log('index:' + index + '  ' + 10 * index);
                        win.setBadgeLabel(10 * index);
                    }
                }, 20000);
            }
            function stop() {
                $interval.cancel(promise);
            }
            start();

        }
    }));
    developr.append(new gui.MenuItem({
        label: 'Quit',
        click:  function() {
            // Hide the window to give user the feeling of closing immediately
            win.hide();
            // If the new window is still open then close it.
            if (win != null)
                win.close(true);
            // After closing the new window, close the main window.
            win.close();
        }    
    }));

    tray.menu = developr;
    // console.log('our tray is now completed and ready..!!')
})
.controller('windowCtrl', ['$rootScope', '$scope', 'windowFactory', function ($rootScope, $scope, windowFactory) {

    $rootScope.currentVersion = currentVersion;

    $scope.minWindow = function(){
        console.log('minimizing window');
        windowFactory.minWindow();
    }
    $scope.maxWindow = function(){
        // $scope.winRestore = true;  // by default it will be in restare mode.

        console.log('maximizing window');
        windowFactory.maxWindow();
        // $scope.winRestore = !$scope.winRestore;
    }
    $scope.closeWindow = function(){
        console.log('closing application now');
        windowFactory.closeWindow();
    }
}])

.factory('windowFactory',[function(){
    var factory = {};
    factory.maxWindow = function(){
        console.log('Is KioskMode - ' + win.isKioskMode);
        console.log('Is Fullscreen - ' + win.isFullscreen);
        if(win.isKioskMode){
            win.leaveKioskMode();
            win.restore();
        }
        else if (win.isFullscreen){
            win.toggleFullscreen();
            //win.restore();
        }
        else
        win.toggleFullscreen();
    }
    factory.minWindow = function(){
        win.minimize();
    };

    factory.closeWindow = function(){
        win.on('close', function() {
            // Hide the window to give user the feeling of closing immediately
            this.hide();
            // If the new window is still open then close it.
            if (win != null)
            win.close(true);
            // After closing the new window, close the main window.
            this.close(true);
        });

        win.close();
    }
    return factory;
}])
