/**
 * Created by enahum on 02-09-15.
 */
var app = require('app'),
    browserW = require('browser-window'),
    NativeImage = require('native-image'),
    Tray = require('tray'),
    mainWindow = null;

require('crash-reporter').start();

// Cuando todas las ventanas están cerradas salir de la aplicacion
app.on('window-all-closed', function() {
    // para mantener el comportamiento en OSX de poder cerrar las ventanas sin salir de la app
    if(process.platform !== 'darwin') {
        app.quit();
    }
});
var isWin = /^win/.test(process.platform);
console.log(isWin);
// cuando la aplicacion esta lista ha terminado de inicializarse
app.on('ready', function() {
    var appIcon = NativeImage.createFromPath(__dirname + '/icon.png')
    var tray = new Tray(__dirname + '/icon.png');
    require('./ipc-notify')(tray, appIcon);
    // definimos el tamaño de la aplicación y algunos parametros
    mainWindow = new browserW(
        {
            width: 1024,
            height:600,
            center: true,
            resizable: true,
            fullscreen: false,
            icon: appIcon
        });


    //establecemos la entrada a la aplicación
    mainWindow.loadUrl('file://' + __dirname + '/index.html');
});