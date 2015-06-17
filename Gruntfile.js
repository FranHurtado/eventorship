module.exports = function (grunt) {
	grunt.initConfig({
  		po_json: {
    		target: {
      			files: {
        			'locales/en.json': 'locales/en.po',
        			'locales/es.json': 'locales/es.po'
      			}	
    		},
  		},
	});

	grunt.loadNpmTasks('grunt-po-json');
	grunt.registerTask('locales', ['po_json']);
};