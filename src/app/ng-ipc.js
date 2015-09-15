var angular = require('angular');
window.require = window.require || function(name) {
      return {
          send: function(type, obj){
              return null;
          }
      };
    }; // esta funcion es solo un bypass porque los test arrojan el error window.require not defined

angular.module('ngIpc', [])
    .service('$ipc', function() {
        var ipc = window.require('ipc');
        this.notify = function(title, message) {
            ipc.send('notify', {
                title: title,
                message: message
            });
        };
    });