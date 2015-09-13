/**
 * Created by enahum on 09-09-15.
 */
module.exports = ['$scope', '$rootScope', 'StreamService',
    function($scope, $rootScope, StreamService) {
        $scope.srv = StreamService;
        $scope.sortby = 'date';

        $scope.$on('noresponse', function(event, username) {
            noty({
                text: username + ' no responde',
                type: 'error',
                theme: 'relax',
                dismissQueue: true,
                killer: true,
                layout: 'center',
                timeout: 3000,
                animation: {
                    open: 'animated flipInX',
                    close: 'animated flipOutX'
                }
            });
        });

        $scope.$on('rejected', function(event, username){
            noty({
                text: username + ' rechazó tu llamada',
                type: 'error',
                theme: 'relax',
                dismissQueue: true,
                killer: true,
                layout: 'center',
                timeout: 3000,
                animation: {
                    open: 'animated flipInX',
                    close: 'animated flipOutX'
                }
            });
        });

        $scope.makeCall = function($index) {
            StreamService.makeCall($index, function(user, data) {
                if(data) {
                    noty({
                        text: data.message,
                        type: 'warning',
                        theme: 'relax',
                        dismissQueue: true,
                        layout: 'center',
                        killer: true,
                        timeout: 3000,
                        animation: {
                            open: 'animated flipInX',
                            close: 'animated flipOutX'
                        }
                    });
                } else {
                    noty({
                        text: 'Llamando a ' + user + '...',
                        type: 'success',
                        theme: 'relax',
                        dismissQueue: true,
                        layout: 'center',
                        killer: true,
                        animation: {
                            open: 'animated flipInX',
                            close: 'animated flipOutX'
                        }
                    });
                }
            });
        };
    }];