/**
 * Created by enahum on 03-09-15.
 */
module.exports = ['$window', '$scope', '$rootScope', '$timeout', 'StreamService', '$ipc',
    function($window, $scope, $rootScope, $timeout, StreamService, $ipc) {
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

        /**
         * Metodo que muestra los iconos de operaciones en el DOM
         */
        showIcons = function() {
            angular.element(document.querySelector('#icons')).removeClass('hidden').addClass('active');
            if(icons) {
                $timeout.cancel(icons);
            }
            icons = $timeout(function() {
                angular.element(document.querySelector('#icons')).removeClass('active').addClass('hidden');
            }, 5000);
        };

        $scope.srv = StreamService;
        $scope.localVideo = true;
        $scope.connected = false;
        $scope.waiting = false;
        $scope.status = null;

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
            StreamService.hangup();
            StreamService.localStream = null;
            $scope.connected = false;
            $scope.waiting = false;
            $scope.status = null;
            angular.element(document.querySelector('#icons')).removeClass('active').addClass('hidden');

            if(webrtc) {
                webrtc.leaveRoom();
                webrtc.stopLocalVideo();
            }

            $rootScope.go('list');
        };

        $scope.$on('stopVideo', function(){
            if(webrtc) {
                webrtc.leaveRoom();
                webrtc.stopLocalVideo();
            }
        });

        $scope.$on('showIcons', function(){
            showIcons();
        });

        $scope.$on('$viewContentLoaded', function(){
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
                webrtc.joinRoom(StreamService.room);
                console.log(StreamService.room);
                $scope.$apply(function() {
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
                        $scope.$apply(function(){
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
        });
    }];