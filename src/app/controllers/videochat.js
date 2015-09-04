/**
 * Created by enahum on 03-09-15.
 */
module.exports = ['$window', '$scope', '$rootScope', '$timeout', 'StreamService',
    function($window, $scope, $rootScope, $timeout, StreamService) {
        var attachMediaStream = require('attachmediastream'),
            webrtc,
            icons,
            toogleAudioVideo,
            showIcons;

        /**
         * Metodo que permite pausar o resumir el video y silenciar o reactivar el sonido del media local
         * @param {String} who
         * @param {Boolean} isOn
         * @export
         */
        toogleAudioVideo = function(who, isOn) {
            switch (who) {
                case 'mute-video':
                    isOn ? webrtc.pauseVideo() : webrtc.resumeVideo();
                    return true;
                    break;
                case 'mute-audio':
                    isOn ? webrtc.mute() : webrtc.unmute();
                    return true;
                    break;
                default :
                    return false;
            }
        };

        showIcons = function() {
            angular.element(document.querySelector('#icons')).removeClass('hidden').addClass('active');
            if(icons) {
                $timeout.cancel(icons);
            }
            icons = $timeout(function() {
                angular.element(document.querySelector('#icons')).removeClass('active').addClass('hidden');
            }, 5000);
        };

        $scope.hide = {
            room_selection: false,
            videos: true
        };
        $scope.connected = false;
        $scope.waiting = false;
        $scope.status = null;
        $scope.online = $window.navigator.onLine;

        // identificamos cuando esta desconectado
        $window.addEventListener("offline", function () {
            $scope.$apply(function() {
                $scope.online = false;
            });
        }, false);

        // identificamos cuando esta conectado
        $window.addEventListener("online", function () {
            $scope.$apply(function () {
                $scope.online = true;
            });
        }, false);

        $window.addEventListener('mousemove', function() {
           if($scope.hide.room_selection) {
               showIcons();
           }
        });

        $rootScope.$on('online', function() {
            $scope.online = true;
        });

        $rootScope.$on('offline', function() {
            $scope.online = false;
        });

        /**
         * Metodo que se utiliza
         * @param who
         */
        $scope.toggle = function(who) {
            var elm = angular.element(document.querySelector('#' + who)),
                isOn = false;
            if(elm.hasClass('on')) {
                elm.removeClass('on');
            }
            else {
                isOn = true;
                elm.addClass('on');
            }
            return toogleAudioVideo(who, isOn);
        };

        /**
         * Cuelga la llamada
         */
        $scope.colgar = function() {
            if(webrtc) {
                webrtc.leaveRoom();
                webrtc.stopLocalVideo();
                StreamService.localStream = null;
                $scope.hide.videos = true;
                $scope.hide.room_selection = false;
                $scope.connected = false;
                $scope.waiting = false;
                $scope.status = null;
                angular.element(document.querySelector('#icons')).removeClass('active').addClass('hidden');
                return true;
            }

            return false;
        };


        /**
         * Metodo que ejecutamos luego de especificar la sala a unirse
         * Inicializa el video y el audio y controlla cuando otra persona se incorpora a la llamada
         */
        $scope.ingresar = function() {
            // inicializamos el video y el audio
            if(!webrtc) {
                webrtc = new SimpleWebRTC({
                    localVideoEl: 'local-video',
                    remoteVideosEl: '',
                    autoRequestMedia: true,
                    debug: false,
                    detectSpeakingEvents: true,
                    autoAdjustMic: false
                });
            } else {
                webrtc.startLocalVideo();
            }

            // una vez inicializado el video y audio nos unimos a la sala (llamada)
            webrtc.on('readyToCall', function () {
                webrtc.joinRoom($scope.nombreSala);
                $scope.$apply(function() {
                    $scope.hide.videos = false;
                    $scope.hide.room_selection = true;
                    $scope.waiting = true;
                });
            });

            // Esto nos permite obtener el stream local para poder moverlo entre los diferentes contenedores
            webrtc.on('localStream', function (stream) {
                StreamService.localStream = stream;
            });

            // Cuando no se pudo obtener acceso a la camara
            webrtc.on('localMediaError', function (err) {
            });

            // Cuando se ha unido la otra persona a la llamada obtenemos el stream remoto y distribuimos los streams en sus respectivos contenedores
            webrtc.on('videoAdded', function (video, peer) {
                var local, remote, mini, hangup;
                local = document.getElementById('local-video');
                remote = document.getElementById('remote-video');
                mini = document.getElementById('mini-video');
                hangup = document.getElementById('hangup');
                StreamService.remoteStream = peer.stream;
                attachMediaStream(StreamService.remoteStream, remote);
                angular.element(remote).addClass('active');
                angular.element(local).removeClass('active');
                angular.element(hangup).removeClass('hidden');
                local.src = '';
                angular.element(mini).addClass('active');
                attachMediaStream(StreamService.localStream, mini);

                // show the ice connection state
                if (peer && peer.pc) {
                    peer.pc.on('iceConnectionStateChange', function (event) {
                        switch (peer.pc.iceConnectionState) {
                            case 'checking':
                                $scope.status = 'Conectando...';
                                break;
                            case 'connected':
                            case 'completed': // on caller side
                                $scope.status = 'Conectado.';
                                $scope.connected = true;
                                $scope.waiting = false;
                                break;
                            case 'disconnected':
                                $scope.status = 'Disconectado.';
                                break;
                            case 'failed':
                                $scope.status = 'Conexión fallida';
                                break;
                            case 'closed':
                                $scope.status = 'Conexión cerrada';
                                break;
                        }
                    });
                }
            });

            // Cuando la persona remota abandona la llamada removemos el stream remoto y redistribuimos los contenedores
            webrtc.on('videoRemoved', function (video, peer) {
                var local, remote, mini, hangup;
                local = document.getElementById('local-video');
                remote = document.getElementById('remote-video');
                mini = document.getElementById('mini-video');
                hangup = document.getElementById('hangup');
                StreamService.remoteStream = null;
                angular.element(mini).removeClass('active');
                angular.element(remote).removeClass('active');
                angular.element(hangup).addClass('hidden');
                angular.element(local).addClass('active');
                attachMediaStream(StreamService.localStream, local);
                $scope.connected = false;
                $scope.waiting = true;
                $scope.status = null;
            });

            webrtc.on('iceFailed', function (peer) {
                console.log('local fail');
            });

            // remote p2p/ice failure
            webrtc.on('connectivityError', function (peer) {
                console.log('remote fail');
            });

            return webrtc;
        };

    }];