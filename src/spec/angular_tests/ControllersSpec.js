/**
 * Created by enahum on 03-09-15.
 */
'use strict';

describe('Controllers', function() {
    var $rootScope, $scope, $controller, $window, $timeout, streamService;

    beforeEach(module('zboxApp'));

    describe('StartController', function() {
        beforeEach(inject(function(_$rootScope_, _$controller_){
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $controller = _$controller_;

            $controller('startController', {'$scope': $scope, '$rootScope' : $rootScope});
        }));

        it('should be defined', function() {
            return expect($controller).not.toBeUndefined();
        });

        it('timeout is set to null', function() {
            return expect($rootScope.timeout).toBeNull();
        })
    });

    describe('videochat Controller', function() {
        var originalTimeout;
        beforeEach(function() {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });

        beforeEach(inject(function(_$window_, _$rootScope_, _$timeout_, StreamService, _$controller_, $injector){
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $controller = _$controller_;
            streamService = $injector.get('StreamService');
            $controller('videochatController', {'$scope': $scope, '$rootScope' : $rootScope});
        }));

        it('should be defined', function() {
            expect(streamService).not.toBeUndefined();
            return expect($controller).not.toBeUndefined();
        });

        it('should be online', function() {
           return expect($scope.online).toBe(true);
        });

        it('should be not be waiting', function() {
            return expect($scope.waiting).toBe(false);
        });

        it('should be not be connected', function() {
            return expect($scope.connected).toBe(false);
        });

        it('should be without sala', function() {
            return expect($scope.nombreSala).toBeUndefined();
        });

        it('should start and then stop localStream', function(done) {
            var webrtc, colgar;
            $scope.nombreSala = 'prueba';
            webrtc = $scope.ingresar();
            webrtc.on('localStream', function(){
                expect(streamService.localStream).not.toBeNull();
                colgar = $scope.colgar();
                expect(colgar).toBe(true);
                expect(streamService.localStream).toBeNull();
                done();
            });

            setTimeout(function(){
                expect(streamService.localStream).not.toBeNull();
                done();
            }, 5000);
        });

    });
});