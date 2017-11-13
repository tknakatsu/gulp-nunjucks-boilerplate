var gulp = require('gulp');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var browserSync = require('browser-sync');
var nunjucks = require('gulp-nunjucks-render');

var paths ={
    'nunjucks': {
        'srcRoot': './',
        'src': ['src/njk/**/*.njk', '!src/sass/**/_*.njk'],
        'dest': 'dest/html'
    },
    'sass': {
        'srcRoot': './',
        'src': ['src/sass/**/*.scss', '!src/sass/**/_*.scss'],
        'dest': 'dest/css'
    }
}

// sass
gulp.task('sass', function() {
  return gulp.src(paths.sass.src)
  .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
  .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(gulp.dest(paths.sass.dest))
  .pipe(browserSync.stream());
});

// nunjucks
gulp.task('nunjucks', function() {
  return gulp.src(paths.nunjucks.src)
  .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
  .pipe(nunjucks({
    pretty: true
  }))
  .pipe(gulp.dest(paths.nunjucks.dest));
});

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: 'dest/',
            index: 'html/index.html',
        },
        notify: true,
        ghostMode: {
            scroll: false
        }
    });
});

// Reload all browsers
gulp.task('bs-reload', function (){
    browserSync.reload();
});

// watch
gulp.task('watch', ['sass', 'nunjucks', 'browser-sync'], function() {
  gulp.watch('src/sass/**', ['sass']);
  gulp.watch('src/nunjucks/**', ['nunjucks']);
  gulp.watch('dest/html/**').on('change', browserSync.reload);
});

// default task
gulp.task('default', ['watch'], function() {});