module.exports.tasks = {
	/**
	* scss Lint
	* https://github.com/ahmednuaman/grunt-scss-lint
	*/
	scsslint: {
		allFiles: [
			'<%=config.css.scssDir%>/**/*.scss',
		],
		options: {
			config: '.scss-lint.yml',
			reporterOutput: null
		},
	},


	/**
	 * Grunt Sass Lint
	 * Uses https://github.com/sasstools/sass-lint, a node-based version
	 * https://github.com/sasstools/grunt-sass-lint
	 */
	sasslint: {
		options: {
			configFile: '.sass-lint.yml',
		},
		target: ['<%=config.css.scssDir%>/**/*.scss'],
	},


	/**
	* JSHint
	* https://github.com/gruntjs/grunt-contrib-jshint
	* Manage the options inside .jshintrc file
	*/
	jshint: {
		options: {
			jshintrc: '.jshintrc',
			reporter: require('jshint-stylish')
		},
		project: [
			'<%=config.srcDir%>/js/**/*.js',
			'!<%=config.srcDir%>/js/{standalone,helpers}/**/*.js',
			'!<%=config.srcDir%>/js/**/*.min.js'
		]
	}
};
