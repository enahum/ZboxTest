/**
 * Created by enahum on 04-09-15.
 */
var gulp = require('gulp'),
    electron = require('gulp-electron'),
    packageJson = require('./src/package.json'),
    ign = require('gulp-ignore'),
    rimraf = require('rimraf');

process.NODE_ENV = 'test';


gulp.task('build', function() {
    return gulp.src("")
        .pipe(electron({
            src: './src',
            packageJson: packageJson,
            release: './release',
            cache: './cache',
            version: 'v0.31.2',
            packaging: true,
            platforms: ['win32-x64', 'darwin-x64', 'linux-x64'],
            asar: true,
            platformResources: {
                darwin: {
                    CFBundleDisplayName: packageJson.name,
                    CFBundleIdentifier: packageJson.name,
                    CFBundleName: packageJson.name,
                    CFBundleVersion: packageJson.version,
                    icon: 'gulp-electron.icns'
                },
                win: {
                    "version-string": packageJson.version,
                    "file-version": packageJson.version,
                    "product-version": packageJson.version,
                    "icon": 'gulp-electron.ico'
                }
            }
        }))
        .pipe(gulp.dest(""));
});