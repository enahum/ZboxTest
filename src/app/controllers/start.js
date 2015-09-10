/**
 * Created by enahum on 03-09-15.
 *
 * Controlador que define algunas funciones generales
 */
var io = require('socket.io-client');

module.exports = ['$window', '$rootScope', '$state', 'SocketURL',
    function($window, $rootScope, $state, SocketURL) {
        $rootScope.client = null;

        $rootScope.go = function(where, params){
            if(params)
                $state.go(where, params);
            else
                $state.go(where);
        };

        $rootScope.client = io.connect(SocketURL, { reconnect: true });

        $rootScope.client.on('connect', function() {
            $rootScope.$emit('online');
        });

        $rootScope.client.on('connect_failed', function(){
            $rootScope.$emit('offline');
        });

        $rootScope.client.on('disconnect', function(){
            $rootScope.$emit('offline');
        });

    }];

