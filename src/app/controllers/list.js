/**
 * Created by enahum on 09-09-15.
 */
module.exports = ['$scope', '$rootScope', '$timeout', 'StreamService', '$ipc',
    function($scope, $rootScope, $timeout, StreamService, $ipc) {
        $scope.online = true;

        $rootScope.$on('online', function() {
            if(StreamService.username) {
                StreamService.login(StreamService.username, function(result){
                    if(!result) {
                        $rootScope.go('join');
                    }
                });
            }
            else {
                $rootScope.go('join');
            }
            $scope.$apply(function(){
                $scope.online = true;
            });
        });

        $rootScope.$on('offline', function(){
            $scope.$apply(function(){
                $scope.online = false;
            });
        });

        $rootScope.client.on('signed', function(username){
            $ipc.notify('zBox', username + ' se ha conectado');
        });
    }];