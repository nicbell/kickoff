'use strict';

/**
 * Find Gulp plugins at http://gulpjs.com/plugins/
 *
 * TODO & NOTES:
 * https://www.npmjs.com/package/gulp-scss-lint/
 * https://www.npmjs.com/package/del/
 * https://www.npmjs.com/package/gulp-imagemin/
 * https://www.npmjs.com/package/gulp-iconify
 * https://github.com/tracker1/gulp-header
 * https://github.com/greypants/gulp-starter
 * https://github.com/mrmartineau/martineau.tv/blob/master/gulpfile.js#L142
 * http://stackoverflow.com/questions/24730215/gulp-newer-vs-gulp-changed
 * https://github.com/robrich/gulp-if
 * https://www.npmjs.com/package/gulp-sourcemaps
 * http://ricostacruz.com/cheatsheets/gulp.html
 */

// Include Gulp & Tools We'll Use
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var pkg         = require('./package.json');

// Config vars and settings
var CONFIG      = require('./gulp/config.js');

// Imagemin plugins
var mozjpeg     = require('imagemin-mozjpeg');
var pngquant    = require('imagemin-pngquant');
var gifsicle    = require('imagemin-gifsicle');


// JAVASCRIPT
// Not using Browserify, yet
gulp.task('js', function() {
	return gulp.src(CONFIG.JS.FILELIST)
		.pipe($.sourcemaps.init())
			.pipe($.concat('app.js'))
		.pipe($.sourcemaps.write())
		.pipe($.if(CONFIG.PRODUCTION, $.uglify()))
		// .pipe($.header(CONFIG.BANNER, { pkg : pkg } ))
		.pipe(gulp.dest(CONFIG.JS.DISTDIR))
		.pipe($.size({title: 'JS compiled', gzip: true}));
});
gulp.task('js-watch', ['js'], browserSync.reload);


// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function () {
	return gulp.src(CONFIG.CSS.SCSSFILES)
		.pipe($.sourcemaps.init())
			.pipe($.sass({
				precision: 10,
				onError: console.error.bind(console, 'Sass error:\n')
			}))
		.pipe($.sourcemaps.write())
		.pipe($.autoprefixer({browsers: CONFIG.CSS.AUTOPREFIXER_BROWSERS}))

		// Minify styles only if CONFIG.PRODUCTION === true
		.pipe($.if(CONFIG.PRODUCTION, $.csso() ))
		.pipe($.if(CONFIG.PRODUCTION, $.header(CONFIG.BANNER, {pkg:pkg}) ))

		.pipe(gulp.dest(CONFIG.CSS.DISTDIR))
		.pipe(reload({ stream:true }))
		.pipe($.size({title: 'Styles compiled', gzip: true}));
});


// Serve site, watch files for changes & reload
gulp.task('serve', ['styles', 'js'], function () {
	browserSync({
		server: {
			baseDir: "./"
		}
	});


	gulp.watch([
			'./**/*.html'
	], reload);
	gulp.watch([CONFIG.CSS.SCSSDIR +'/**/*.scss'], ['styles']);
	gulp.watch([CONFIG.JS.FILELIST], ['js-watch']);
	// gulp.watch(['img/**/*'], browserSync.reload);
	// gulp.watch(['*.html'], reload({stream:true}));
});


// https://github.com/sindresorhus/gulp-imagemin
gulp.task('imagemin', function () {
	return gulp.src([CONFIG.IMG.SRCDIR + '/**/*.{svg,png,jpg,gif}', '!'+CONFIG.IMG.SRCDIR +'/icons/source/**/*.{svg,png,jpg,gif}'])
		// needs a 'newer' task to check if we need to run this?
		.pipe($.imagemin({
			progressive: true,
			svgoPlugins: [
				{ removeViewBox: false },
				{ removeUselessStrokeAndFill: false }
			],
			use: [
				mozjpeg(),
				pngquant(),
				gifsicle()
			]
		}))
		// possibly needs a clean to remove old images?
		.pipe(gulp.dest(CONFIG.IMG.DISTDIR));
});


// Used to only minify the assets in the /icons/source dir
gulp.task('icons', function () {
	return gulp.src([CONFIG.IMG.SRCDIR +'/icons/source/**/*.{svg,png,jpg,gif}'])
		.pipe($.imagemin({
			progressive: true,
			svgoPlugins: [
				{ removeViewBox: false },
				{ removeUselessStrokeAndFill: false }
			],
			use: [
				mozjpeg(),
				pngquant(),
				gifsicle()
			]
		}))
		.pipe() // gulp-iconify
		.pipe(gulp.dest(CONFIG.IMG.DISTDIR));
});


// Build Production Files, the Default Task
gulp.task('default', function (cb) {
	runSequence('styles', ['js'], cb);
});

// Watch task
gulp.task('watch', ['styles', 'js'], function () {

});

// Lint JavaScript
gulp.task('jshint', function () {
	return gulp.src(CONFIG.JS.FILELIST)
		.pipe(reload({stream: true, once: true}))
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'))
		.pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});
