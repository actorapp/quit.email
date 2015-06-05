'use strict';

var assign = require('object-assign');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var through = require('through2');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var reactify = require('reactify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var watchify = require('watchify');
var modRewrite = require('connect-modrewrite');
var reload = browserSync.reload;

// add custom browserify options here
var customOpts = {
  entries: ['app/app.react.js'],
  debug: true,
  transform: [reactify]
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe(rename('js/app.js'))
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({stream: true, once: true}));
}

gulp.task('html', function() {
  gulp.src('app/index.html')
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'dist',
      middleware: [
        modRewrite([
          '^[^\\.]*$ /index.html [L]'
        ])
      ]
    }
  });

  gulp.watch(['*.html', 'css/**/*.css', 'js/**/*.js'], {cwd: 'app'}, reload);
});

gulp.task('dev', ['js', 'html', 'serve']);
