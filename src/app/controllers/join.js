/**
 * JoinController permite ingresar a la aplicación como un usuario
 */

module.exports = ['$scope', '$rootScope', 'StreamService',
    function($scope, $rootScope, StreamService) {
        $scope.srv = StreamService;

        /**
         * Realiza el inicio de sesion
         */
        $scope.ingresar = function() {
            StreamService.login(function(result){
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