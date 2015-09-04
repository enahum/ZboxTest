/**
 * Created by enahum on 02-09-15.
 */

// utilizamos require porque las librerias de angular serán cargadas con browserify
require('angular');
require('angular-messages');
require('angular-bootstrap');
require('angular-i18n/angular-locale_es-cl');
require('angular-ui-router');
require('angular-fullscreen')(angular);

//declaramos la app en angular
var app = angular.module('zboxApp', ['ui.router', 'ui.bootstrap', 'ngMessages', 'angularFullscreen']);


//cargamos las rutas de la app
app.config(require('./routes'));

// cargamos los servicios disponibles
app.factory('StreamService', require('./services/streamService'));

// cargamos el controlador principal
app.controller('startController', require('./controllers/start'));
app.controller('videochatController', require('./controllers/videochat'));