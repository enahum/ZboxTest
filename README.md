# zBox Test - Desafío Dev. Node.js

[![Build Status](https://travis-ci.org/atom/electron.svg?branch=master)](https://travis-ci.org/atom/electron)
[![devDependency Status](https://david-dm.org/atom/electron/dev-status.svg)](https://david-dm.org/atom/electron#info=devDependencies)

zBox Test es una aplicación multi-plataforma basada en [Atom Electron](http://electron.atom.io/) y [SimpleWebRTC](http://simplewebrtc.com) que permite realizar una llamada en video conferencia entre 2 personas.

## Disponible para Windows, Mac OSX y Linux

Descarga la aplicación para tu plataforma:
* [Windows 32-bit](http://github.com/enahum/zBoxTest/releases/download/v1.1.0/zbox-1.1.0-win32-ia32.zip) o [Windows 64-bit](http://github.com/enahum/zBoxTest/releases/download/v1.1.0/zbox-1.1.0-win32-x64.zip)
* [Mac OSX](http://github.com/enahum/zBoxTest/releases/download/v1.1.0/zbox-1.1.0-darwin-x64.zip)
* [Linux](http://github.com/enahum/zBoxTest/releases/download/v1.1.0/zbox-1.1.0-win32-x64.zip)

## Como ejecutarlo
1. Descomprime el archivo .zip
2. Ejecuta el archivo zbox
  1. En Windows zbox.exe
  2. En Mac OSX zbox.app
  3. En Linux zbox

## Super facil de utilizar:

### 1. Ingresa tu nombre

Especifica el tu nombre o un sobrenombre con el que te darás a conocer y te identificaran los demas

### 2. Selecciona a quien llamar

Busca o selecciona una persona que te aparece en la lista y presiona el icono de llamar

### 3. Atiende la llamada

La persona a la que llamas tiene la capacidad de aceptar o rechazar la llamada, al aceptar comenzarán hablar


## Problemas conocidos

En Winows Vista (32bit) arroja un error en vez de mostrar las notificaciones presentando una pantalla de alerta, 
este es un error causado por [node-notifier](https://github.com/mikaelbr/node-notifier)
