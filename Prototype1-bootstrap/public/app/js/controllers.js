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