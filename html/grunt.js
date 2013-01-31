/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */
 
module.exports = function(grunt) {
//	require('grunt-css')(grunt);

	// Project configuration.
	grunt.initConfig({
	    pkg: '<json:application.json>',

		test: {
			all: ['test/**/*.js']
		},
		lint: {
			all: ['grunt.js', 'lib/**/*.js', 'tasks/*.js', 'tasks/*/*.js', 'test/**/*.js']
		},
		watch: {
			scripts: {
				files: '<config:lint.all>',
				tasks: 'lint test'
			}
		},
		concat: {
			css: {
				src:
					[ 'css/normalize.css'
					, 'css/main.css'
					, 'css/bootstrap.css'
					, 'css/bootstrap-responsive.css'
					, 'css/index.css'
					, 'css/login.css'
					, 'css/dashboard.css'
					],
				dest: 'css/<%= pkg.name %>.css'
			},
			lib: {
				src:
					[ 'lib/jquery-1.7.1.js'
					, 'lib/jquery.md5.js'
					, 'lib/jquery.validate.min.js'
					, 'lib/bootstrap.min.js'
					, 'lib/handlebars.js'
					, 'lib/ember.js'

					, 'lib/jquery.jqplot.min.js'
					, 'lib/jqplot.barRenderer.min.js'
					, 'lib/jqplot.categoryAxisRenderer.min.js'
					, 'lib/jqplot.pointLabels.min.js'

					, 'lib/plugins.js'
					, 'lib/main.js'
					],
				dest: 'lib/<%= pkg.name %>.js'
			},
			js: {
				src:
					[ 'js/IHS-util.js'
					, 'js/index.js'
					, 'js/login.js'
					, 'js/logout.js'
					, 'js/dashboard.js'
					, 'models/user.js'
					],
				dest: 'js/<%= pkg.name %>.js'
			},
		},
/*
		cssmin: {
			css: {
				src : 'css/<%= pkg.name %>.css',
				dest: 'css/<%= pkg.name %>.min.css'
			},
		},
*/		
		min: {
			lib: {
				src: ['lib/<%= pkg.name %>.js'],
				dest: 'lib/<%= pkg.name %>.min.js'
			},
			js: {
				src: ['js/<%= pkg.name %>.js'],
				dest: 'js/<%= pkg.name %>.min.js'
			},
		},
		globals: {}
	});

	grunt.loadNpmTasks('grunt-css');

	// Default task.
	grunt.registerTask('default', 'concat min');

};
