/**
 * Created by enahum on 03-09-15.
 *
 * Controlador que define algunas funciones generales
 */
var io = require('socket.io-client');

module.exports = ['$window', '$rootScope', '$state', '$timeout', 'StreamService',
    function($window, $rootScope, $state, $timeout, StreamService) {
        var timedout,
            removeNotifications = function() {
                var notifications = document.getElementById('noty_center_layout_container');
                if(notifications) {
                    notifications.parentNode.removeChild(notifications);
                }
            };

        $window.addEventListener('mousemove', function() {
            $rootScope.$broadcast('showIcons');
        });

        $rootScope.go = function(where, params){
            if(params)
                $state.go(where, params);
            else
                $state.go(where);
        };

        $rootScope.$on('join', function(){
           $state.go('join');
        });

        $rootScope.$on('list', function(){
            $state.go('list');
        });

        $rootScope.$on('left', function(event, user){
            removeNotifications();

            if(timedout) {
                $timeout.cancel(timedout);
            }

            if($state.is('videocall')) {
                $state.go('list');
            }
        });

        $rootScope.$on('calling', function(event, username){
            timedout = $timeout(function() {
                removeNotifications();
                StreamService.noResponse(username);
                $timeout.cancel(timedout);
            }, 15000);

            noty({
                text: username + ' llamando ...',
                type: 'confirm',
                theme: 'relax',
                dismissQueue: true,
                killer: true,
                layout: 'center',
                animation: {
                    open: 'animated flipInX',
                    close: 'animated flipOutX'
                },
                buttons: [
                    { addClass: 'btn btn-primary', text: 'Contestar', onClick: function ($noty) {

                        // this = button element
                        // $noty = $noty element

                        $noty.close();
                        if(timedout) {
                            $timeout.cancel(timedout);
                        }
                        StreamService.pickup(username, function(){
                           $rootScope.go('videocall');
                        });
                    }
                    },
                    { addClass: 'btn btn-danger', text: 'Declinar', onClick: function ($noty) {
                        $noty.close();
                        if(timedout) {
                            $timeout.cancel(timedout);
                        }
                        StreamService.reject(username);
                    }
                    }
                ]
            });
        });

        $rootScope.$on('answered', function() {
            var notifications = document.getElementById('noty_center_layout_container');
            if(notifications) {
                notifications.parentNode.removeChild(notifications);
            }
            $rootScope.go('videocall');
        });
    }];

