/**
 * Created by enahum on 03-09-15.
 */
'use strict';

describe('Controllers', function() {
    var $rootScope, $scope, $controller, $window, $timeout, streamService;
    var originalTimeout;

    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    beforeEach(module('zboxApp'));

    describe('Start Controller', function() {
        //$window, $rootScope, $state, $timeout, StreamService
        beforeEach(inject(function(_$rootScope_, _$controller_){
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $controller = _$controller_;

            $controller('startController', {'$scope': $scope, '$rootScope' : $rootScope});
        }));

        it('should be defined', function(done) {
            expect($controller).toBeDefined();
            done();
        });
    });

    describe('Join Controller', function() {
        beforeEach(inject(function(_$rootScope_, _$controller_){
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $controller = _$controller_;

            $controller('joinController', {'$scope': $scope, '$rootScope' : $rootScope});
        }));

        it('should be defined', function(done) {
            expect($controller).toBeDefined();
            done();
        });

        it('should join a user', function(done){
            expect($scope.srv).toBeDefined();
            $scope.srv.username = 'Elias';
            $scope.ingresar();
            expect($scope.loginStatus).toBeUndefined();
            done();
        });
    });
});