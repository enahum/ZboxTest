/**
 * Created by enahum on 03-09-15.
 *
 * Servicio para almacenar tanto el stream local como el remoto
 */
var io = require('socket.io-client');

module.exports = ['$rootScope', 'SocketURL', '$ipc', '$timeout',
    function($rootScope, SocketURL, $ipc, $timeout) {
        var srv ={
                online: false,
                logged: false,
                username: null,
                room: null,
                localStream: null,
                remoteStream: null,
                users: [],
                findUserIndex: function(username) {
                    var users = srv.users, i = users.length;
                    for(; --i >= 0;) {
                        if(users[i].name === username) {
                            return i;
                        }
                    }
                    return -1;
                },
                login: function(callback){
                    client.emit('login', {name: srv.username}, function(result) {
                        $rootScope.$apply(function(){
                            if(result) {
                                srv.logged = true;
                                srv.getUsers();
                            }
                            else {
                                srv.logged = false;
                                srv.users = [];
                            }
                        });
                        if (callback && typeof callback === typeof Function){
                            callback(result);
                        }
                    });
                },
                getUsers: function() {
                    client.emit('list', function(users){
                        var i = users.length;
                        if(i > 0) {
                            $rootScope.$apply(function() {
                                srv.users = users;
                            });
                        }
                    });
                },
                makeCall: function($index, callback) {
                    var user = this.users[$index];
                    client.emit('call', user.name, function(data){
                        if (callback && typeof callback === typeof Function){
                            callback(user.name, data);
                        }
                    });
                },
                pickup: function(username, callback) {
                    client.emit('pickup', username, function(room) {
                        $rootScope.$apply(function(){
                            srv.room = room;
                        });
                        if (callback && typeof callback === typeof Function){
                            callback(room);
                        }
                    })
                },
                reject: function(username) {
                    client.emit('reject', username);
                },
                noResponse: function(username) {
                    client.emit('noresponse', username);
                },
                hangup: function() {
                    client.emit('hangup', this.room);
                    this.room = null;
                    this.localStream = null;
                    this.remoteStream = null;
                }
            },
            client = io.connect(SocketURL, { reconnect: true });

        // ocurre al conectarse al servicio
        client.on('connect', function() {
            $rootScope.$apply(function(){
                srv.online = true;
            });
            if(srv.username && srv.logged) {
                srv.login(function(result){
                    if(!result) {
                        $rootScope.$emit('join');
                    }
                });
            } else {
                $rootScope.$emit('join');
            }
        });

        // ocurre cuando alguien ingresa
        client.on('signed', function(user){
            if(srv.logged) {
                $ipc.notify('zBox', user.name + ' se ha conectado');
                $rootScope.$apply(function () {
                    srv.users.push(user);
                });
            }
        });

        // ocurre cuando alguien llama
        client.on('calling', function(username) {
            $ipc.notify('zBox', username + ' está llamando');
            $rootScope.$emit('calling', username);
        });

        // ocurre cuando esta ocupado
        client.on('noresponse', function(username) {
            $rootScope.$broadcast('noresponse', username);
        });

        // ocurre cuando la otra persona rechaza la llamada
        client.on('rejected', function(username) {
            $rootScope.$broadcast('rejected', username);
        });

        // ocurre cuando contestan
        client.on('answered', function(room) {
            $rootScope.$apply(function(){
                srv.room = room;
                $rootScope.$emit('answered');
            });
        });

        // ocurre cuando cuelgan
        client.on('hangup', function() {
            this.room = null;
            this.localStream = null;
            this.remoteStream = null;
            $rootScope.$emit('list');
        });

        // ocurre cuando falla el conectar
        client.on('connect_failed', function(){
            $rootScope.$apply(function(){
                srv.online = false;
                this.room = null;
                srv.users = [];
            });
        });

        // ocurre cuando se desconecta
        client.on('disconnect', function(){
            $rootScope.$apply(function(){
                srv.online = false;
                this.room = null;
                srv.users = [];
            });
        });

        // ocurre cuando alguien se sale
        client.on('logout', function(username) {
            if(srv.logged) {
                var index = -1;
                if (username) {
                    $rootScope.$emit('left', username);
                    index = srv.findUserIndex(username);
                    if (index > -1) {
                        $rootScope.$apply(function () {
                            srv.users.splice(index, 1);
                        });
                    }
                }
            }
        });

        return srv;
    }];