/**
 * Created by enahum on 09-09-15.
 */
var ipc = require('ipc'),
    notifier = require('node-notifier');

module.exports = function(tray, appIcon) {
    ipc.on('notify', function (event, args) {
        var isWin = /^win/.test(process.platform);
        if(isWin) {
            tray.displayBalloon({
                title: args.title,
                content: args.message,
                icon: appIcon
            });
        }
        else {
            notifier.notify({
                title: args.title,
                message: args.message,
                sound: true, // Solo con Notification Center or Windows Toasters
                wait: false,
                time: 5000,
                appIcon: __dirname + '/icon.png'
            });
        }
    });
};