/**
 * Created by enahum on 09-09-15.
 */

module.exports = ['$scope', '$rootScope', '$timeout', 'StreamService', '$ipc',
    function($scope, $rootScope, $timeout, StreamService, $ipc) {
        $scope.online = true;
        $scope.username = StreamService.username;

        $rootScope.$on('online', function(){
           $scope.$apply(function(){
            $scope.online = true;
           });
        });

        $rootScope.$on('offline', function(){
            $scope.$apply(function(){
                $scope.online = false;
            });
        });

        $scope.ingresar = function() {
            StreamService.login($scope.username, function(result){
                switch (result) {
                    case null:
                        $scope.$apply(function(){
                            $scope.loginStatus = 'Nombre de usuario ya está en uso';
                        });
                        break;
                    case false:
                        $scope.$apply(function(){
                            $scope.loginStatus = 'El nombre de usuario es obligatorio';
                        });
                        break;
                    default :
                        $rootScope.go('list');
                }
            });
        };

    }];