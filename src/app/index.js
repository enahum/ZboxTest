/**
 * Created by enahum on 02-09-15.
 */

// utilizamos require porque las librerias de angular serán cargadas con browserify
require('angular');
require('angular-messages');
require('angular-bootstrap');
require('angular-i18n/angular-locale_es-cl');
require('angular-ui-router');
require('./ng-ipc');
require('angular-fullscreen')(angular);

//declaramos la app en angular
var app = angular.module('zboxApp', ['ui.router', 'ui.bootstrap', 'ngMessages', 'angularFullscreen', 'ngIpc']);


//cargamos las rutas de la app
app.config(require('./routes'));

// cargamos los servicios disponibles
app.factory('StreamService', require('./services/streamService'));
app.constant('SocketURL', 'http://localhost:3000/');
// cargamos el controlador principal
app.controller('startController', require('./controllers/start'));
app.controller('joinController', require('./controllers/join'));
app.controller('listController', require('./controllers/list'));
app.controller('videochatController', require('./controllers/videochat'));