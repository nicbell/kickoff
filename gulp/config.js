var ASSETSDIR   = './assets'; // ASSETSDIR
var DISTDIR     = ASSETSDIR + '/dist'; // DISTDIR

module.exports = {
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
		SRCDIR  : ASSETSDIR + '/img', // CONFIG.IMG.SRCDIR
		DISTDIR : DISTDIR + '/img' // CONFIG.IMG.DISTDIR
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
