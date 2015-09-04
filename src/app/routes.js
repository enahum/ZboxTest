/**
 * Created by enahum on 02-09-15.
 *
 * Definimos las rutas con Angular UI Route
 */
module.exports = ['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state('join', {
                url: '/',
                templateUrl: './app/views/videochat.html',
                controller: 'videochatController' //cargamos el controlador con browserify
            });
        $urlRouterProvider.when('', '/');
    }];

