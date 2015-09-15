/**
 * Created by enahum on 04-09-15.
 */
var gulp = require('gulp'),
    electron = require('gulp-electron'),
    packageJson = require('./package.json'),
    rimraf = require('rimraf');

// plugins
var jshint = require('gulp-jshint'),
    gulpif = require('gulp-if'),
    clean = require('gulp-rimraf'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify'),
    minifyCss = require('gulp-minify-css'),
    buffer = require('vinyl-buffer'),
    concat = require('gulp-concat');

process.NODE_ENV = 'test';

// ejecuta lint para determinar si los js tienen algun detalle
gulp.task('lint', function() {
    return gulp.src('./src/app/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

// limpia la carpeta dist donde estan los archivos que se utilizan en ejecución
gulp.task('clean', function(done) {
    return rimraf('./src/dist/', function(){
        done();
    });
});

// minifica los js y los css
gulp.task('minify', function() {
    gulp.src('./src/css/**/*')
        .pipe(gulpif('*.css', minifyCss({compatibility: 'ie8'})))
        .pipe(gulp.dest('./src/dist/css/'));

    return gulp.src('./src/app/index.js')
        .pipe(browserify({
            insertGlobals: true,
            debug: false
        }))
        .pipe(concat('bundled.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./src/dist/'));
});

// publica los archivos necesarios en la carpeta dist
gulp.task('publish', ['clean', 'lint', 'minify'],  function() {
    gulp.src('./src/simpleWebRTC/latest.js')
        .pipe(concat('simplewebrtc.js'))
        .pipe(gulp.dest('./src/dist/'));
});

gulp.task('build', function() {
    return gulp.src("")
        .pipe(electron({
            src: './src',
            packageJson: packageJson,
            release: './release',
            cache: './cache',
            version: 'v0.31.2',
            packaging: true,
            platforms: ['win32-ia32', 'win32-x64', 'darwin-x64', 'linux-x64'],
            asar: true,
            platformResources: {
                darwin: {
                    CFBundleDisplayName: packageJson.name,
                    CFBundleIdentifier: packageJson.name,
                    CFBundleName: packageJson.name,
                    CFBundleVersion: packageJson.version,
                    icon: 'icon.icns'
                },
                win: {
                    "version-string": packageJson.version,
                    "file-version": packageJson.version,
                    "product-version": packageJson.version,
                    "icon": 'icon.ico'
                }
            }
        }))
        .pipe(gulp.dest(""));
});

gulp.task('default', ['publish']);