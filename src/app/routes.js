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
                templateUrl: './app/views/join.html',
                controller: 'joinController'
            })
            .state('list', {
                url: '/list',
                templateUrl: './app/views/list.html',
                controller: 'listController'
            })
            .state('videocall', {
                url: '/videocall',
                templateUrl: './app/views/videochat.html',
                controller: 'videochatController' //cargamos el controlador con browserify
            });
        $urlRouterProvider.when('', '/');
    }];

