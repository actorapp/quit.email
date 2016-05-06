'use strict';

var assign = require('object-assign');
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var gulp = require('gulp');
var gutil = require('gulp-util');
var minifycss = require('gulp-minify-css');
var modRewrite = require('connect-modrewrite');
var reactify = require('reactify');
var reload = browserSync.reload;
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var through = require('through2');
var uglify = require('gulp-uglify');
var watchify = require('watchify');
var ghpages = require('gulp-gh-pages');

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

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src('app/styles/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minifycss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/styles'))
    .pipe(browserSync.stream());
});

gulp.task('static', function() {
  gulp.src([
    'app/index.html',
    'app/robots.txt'
  ])
    .pipe(gulp.dest('./dist'));

  gulp.src('app/img/**/*')
    .pipe(gulp.dest('./dist/img'));

  gulp.src('app/CNAME')
    .pipe(gulp.dest('./dist'));
});

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: './dist',
      middleware: [
        modRewrite([
          '^[^\\.]*$ /index.html [L]'
        ])
      ]
    },
    https: true,
    // Here you can disable/enable each feature individually
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: false
    },
    open: false
  });

  gulp.watch('app/styles/*.scss', ['sass']);
  gulp.watch(['app/*.html', 'app/js/**/*.js']).on('change', reload);
  //gulp.watch(['*.html', 'css/**/*.css', 'js/**/*.js'], {cwd: 'app'}, reload);
});

gulp.task('ghpages', ['build'], function() {
  return gulp.src('./dist/**/*')
    .pipe(ghpages());
});

gulp.task('build', ['js', 'sass', 'static']);

gulp.task('dev', ['build', 'serve']);

gulp.task('deploy', ['build', 'ghpages']);
