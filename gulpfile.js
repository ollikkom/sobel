'use strict';

const gulp = require('gulp');
const less = require('gulp-less');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');
//const newer = require('gulp-newer');
const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
const notify = require('gulp-notify');
const combiner = require('stream-combiner2').obj;

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('styles', function() {

    return combiner(
        gulp.src('frontend/styles/**/*.less'),
        gulpIf(isDevelopment, sourcemaps.init()),
        less(),
        gulpIf(isDevelopment, sourcemaps.write()),
        gulp.dest('public')
    ).on('error', notify.onError());

});

gulp.task('clean', function() {
    return del('public');
});

gulp.task('assets', function() {
    return gulp.src('frontend/assets/**', {since: gulp.lastRun('assets')})
        .pipe(debug({title: 'assets'}))
        .pipe(gulp.dest('public'));
});


gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('styles', 'assets'))
);

gulp.task('watch', function() {
    gulp.watch('frontend/styles/**/*.*', gulp.series('styles'));

    gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));
});

gulp.task('serve', function() {
    browserSync.init({
        server: 'public'
    });

    browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev',
    gulp.series('build', gulp.parallel('watch', 'serve'))
);