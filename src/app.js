/**
 * Created by enahum on 02-09-15.
 */
var app = require('app'),
    browserW = require('browser-window'),
    NativeImage = require('native-image'),
    mainWindow = null;


// Cuando todas las ventanas están cerradas salir de la aplicacion
app.on('window-all-closed', function() {
    // para mantener el comportamiento en OSX de poder cerrar las ventanas sin salir de la app
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

// cuando la aplicacion esta lista ha terminado de inicializarse
app.on('ready', function() {
    // definimos el tamaño de la aplicación y algunos parametros
    mainWindow = new browserW(
        {
            width: 800,
            height:600,
            center: true,
            resizable: true,
            fullscreen: false,
            icon: NativeImage.createFromPath(__dirname + '/icon.png')
        });


    //establecemos la entrada a la aplicación
    mainWindow.loadUrl('file://' + __dirname + '/index.html');
});