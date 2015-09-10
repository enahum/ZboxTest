/**
 * Created by enahum on 03-09-15.
 *
 * Servicio para almacenar tanto el stream local como el remoto
 */
module.exports = ['$rootScope', function($rootScope) {
    return {
        username: null,
        localStream: null,
        remoteStream: null,
        login: function(username, callback){
            var self = this;
            $rootScope.client.emit('login', {name: username}, function(result) {
                if(result) {
                    self.username = username;
                }
                if (callback && typeof callback === typeof Function){
                    callback(result);
                }
            });
        }
    };
}];