/**
 * Created by enahum on 02-09-15.
 */
// gulp y rimraf
var gulp = require('gulp'),
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

// ejecuta lint para determinar si los js tienen algun detalle
gulp.task('lint', function() {
    return gulp.src('./app/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

// limpia la carpeta dist donde estan los archivos que se utilizan en ejecución
gulp.task('clean', function(done) {
    return rimraf('./dist/', function(){
        done();
    });
});

// minifica los js y los css
gulp.task('minify', function() {
    gulp.src('./css/**/*')
        .pipe(gulpif('*.css', minifyCss({compatibility: 'ie8'})))
        .pipe(gulp.dest('./dist/css/'));

    return gulp.src('./app/index.js')
        .pipe(browserify({
            insertGlobals: true,
            debug: false
        }))
        .pipe(concat('bundled.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});

// publica los archivos necesarios en la carpeta dist
gulp.task('publish', ['clean', 'lint', 'minify'],  function() {
    gulp.src('./simpleWebRTC/latest.js')
        .pipe(concat('simplewebrtc.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['publish']);