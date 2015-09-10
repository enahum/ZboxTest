/**
 * Created by enahum on 09-09-15.
 */
var ipc = require('ipc'),
    notifier = require('node-notifier');

ipc.on('notify', function(event, args){
    notifier.notify({
        title: args.title,
        message: args.message,
        sound: true, // Solo con Notification Center or Windows Toasters
        wait: true,
        appIcon: __dirname + '/icon.png'
    });
});