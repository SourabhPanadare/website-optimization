'use strict';

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

const gulp = require('gulp');
const rimraf = require('gulp-rimraf');
const responsive = require('gulp-responsive');
const nodemon = require('gulp-nodemon');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const siteOutput = 'public/dist';
const imageOutput = siteOutput+'/images';
const cssOutput = siteOutput+'/css';
const jsOutput = siteOutput+'/js';

// -----------------------------------------------------------------------------
// Dist Clean
// -----------------------------------------------------------------------------

gulp.task('clean', function() {
  console.log("Clean all files in dist folder");
  return gulp.src("public/dist/*", { read: false }).pipe(rimraf());
});

// -----------------------------------------------------------------------------
// Plugins Bundling
// -----------------------------------------------------------------------------

gulp.task('jsbundle', function(){
  return gulp.src([
    'public/js/jquery.min.js',
    'public/js/popper.min.js',
    'public/js/bootstrap.min.js',
    'public/plugin/modernizr/modernizr.min.js'
  ])
  .pipe(concat('plugins.js'))
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest(jsOutput))
});

// -----------------------------------------------------------------------------
// css and js minification
// -----------------------------------------------------------------------------

gulp.task('cssminify', function () {
  return gulp.src('public/pages/css/*.css')
  .pipe(cleanCSS())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest(cssOutput))
});

gulp.task('jsminify', function() {
  return gulp.src('public/pages/js/*.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(jsOutput))
});

//------------------------------------------------------------------------------
// Other Assets
//------------------------------------------------------------------------------

gulp.task('fonts', function() {
  return gulp.src('public/fonts/*')
  .pipe(gulp.dest('public/dist/fonts'))
})

gulp.task('plugin', function() {
  return gulp.src('public/plugin/**/*')
  .pipe(gulp.dest('public/dist/plugin'))
})

// -----------------------------------------------------------------------------
// Image Responsive
// -----------------------------------------------------------------------------

gulp.task('imgresponsive', function () {
  return gulp.src('public/images/*.{png,jpg}')
    .pipe(responsive({
      'back*':[
        {
          width: 960,
          quality: 50,
          rename: {
            suffix: '-large',
            extname: '.jpg'
          }
        },
        {
          width: 960 * 2,
          quality: 50,
          rename: {
            suffix: '-large@2x',
            extname: '.jpg'
          }
        },
        {
          width: 960,
          quality: 50,
          rename: {
            suffix: '-large',
            extname: '.webp'
          }
        },
        {
          width: 150,
          quality: 50,
          rename: {
            suffix: '-small',
            extname: '.jpg'
          }
        }
      ],

      // produce multiple images from one source
      'banner*': [
        {
          width: 1500,
          quality: 50,
          rename: {
            suffix: '-large',
            extname: '.jpg'
          }
        },
        {
          width: 1500,
          quality: 50,
          rename: {
            suffix: '-large',
            extname: '.webp'
          }
        }
      ]
    }))
    .pipe(gulp.dest(imageOutput));
});


// -----------------------------------------------------------------------------
// node server
// -----------------------------------------------------------------------------

gulp.task('nodemon', function (cb) {

	var started = false;

	return nodemon({
		script: 'app.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple time
		if (!started) {
			cb();
			started = true;
		}
	});
});


// -----------------------------------------------------------------------------
// Static server
// -----------------------------------------------------------------------------

gulp.task('browser-sync',gulp.series('nodemon'), function() {
  browserSync.init({
    server: {
      proxy: "http://localhost:6200",
      files: ["public/**/*.*"],
      baseDir: siteOutput
    }
  });
});

gulp.task('watch',function(){
  gulp.watch('public/css/*.css', gulp.series('cssminify'));
  gulp.watch('public/js/*.js', gulp.series('jsminify'));
});

// -----------------------------------------------------------------------------
// Default task
// -----------------------------------------------------------------------------

gulp.task('default', gulp.parallel('clean','jsbundle','cssminify','jsminify','fonts','plugin','watch','imgresponsive','browser-sync'));
