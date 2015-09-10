var angular = require('angular'),
    ipc = window.require('ipc');

angular.module('ngIpc', [])
    .service('$ipc', function() {
        this.notify = function(title, message) {
            ipc.send('notify', {
                title: title,
                message: message
            });
        };
    });