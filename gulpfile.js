'use strict';

// Include Gulp & Tools We'll Use
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var pkg         = require('./package.json');


var ASSETSDIR = './assets'; // ASSETSDIR
var DISTDIR   = ASSETSDIR + '/dist'; // DISTDIR

var CONFIG = {
	PRODUCTION : true,

	CSS : {
		SRCFILE : 'kickoff',                    // CONFIG.CSS.SRCFILE
		SCSSDIR : ASSETSDIR + '/scss', // CONFIG.CSS.SCSSDIR
		// CONFIG.CSS.SCSSFILES
		SCSSFILES : [
			ASSETSDIR + '/scss/kickoff.scss',
			ASSETSDIR + '/scss/kickoff-old-ie.scss',
			ASSETSDIR + '/scss/styleguide.scss'
		],
		DISTDIR : DISTDIR + '/css',    // CONFIG.CSS.DISTDIR

		AUTOPREFIXER_BROWSERS : [
			'> 5%',
			'last 2 versions',
			'ie > 8'
		]
	},

	JS : {
		DISTDIR  : DISTDIR + '/js/',   // CONFIG.JS.DISTDIR
		DISTFILE : 'app.min.js',                // CONFIG.JS.DISTFILE

		// CONFIG.JS.FILELIST
		FILELIST : [
			// if you would like to remove jQuery from your concatenated JS, comment out the line below
			'bower_modules/jquery/dist/jquery.js',

			// if you would like some basic JS shims (when not using jQuery),
			// uncomment the line below to compile Shimly output
			//'js/helpers/shims.js',

			ASSETSDIR + '/js/helpers/console.js',
			'bower_modules/trak/dist/trak.js',
			'bower_modules/swiftclick/js/libs/swiftclick.js',
			'bower_modules/cookies-js/dist/cookies.js',

			ASSETSDIR + '/js/script.js'
		]
	},

	// CONFIG.IMG
	IMG : {
		DIR : ASSETSDIR + '/img' // CONFIG.IMG.DIR
	},

	// CONFIG.BANNER
	BANNER : ['/**',
		' * <%= pkg.name %> - <%= pkg.description %>',
		' * @version v<%= pkg.version %>',
		' * @link <%= pkg.homepage %>',
		' * @license <%= pkg.license %>',
		' */',
		''].join('\n')
};

// JAVASCRIPT
// Not using Browserify, yet
gulp.task('js', function() {
	return gulp.src(CONFIG.JS.FILELIST)
		.pipe($.sourcemaps.init())
			.pipe($.concat('app.js'))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(CONFIG.JS.DISTDIR))
		.pipe($.size({title: 'Unminified js', gzip: true}))
		.pipe($.uglify())
		.pipe($.rename({suffix: '.min'}))
		.pipe($.header(CONFIG.BANNER, { pkg : pkg } ))
		.pipe(gulp.dest(CONFIG.JS.DISTDIR))
		.pipe($.size({title: 'Minified js',gzip: true}));
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
		notify: false,
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
