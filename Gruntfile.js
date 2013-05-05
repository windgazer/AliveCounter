module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {            
        release: {
            files: {
                'Release/': ['*.html','config.xml','fav*.*','assets/**/*','core/**/*','counters/**/*','libs/**/*','style/**/*']
            }
        }
    },
    clean: {
        afterRelease: ['Release/libs'],
        all: ['Release','libs','node_modules']
    },
    useminPrepare: {
        html: ['Release/index.html']
    },
    usemin: {
        html: ['Release/index.html']
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('default', ['copy:release', 'useminPrepare', 'concat', 'uglify', 'usemin','clean:afterRelease']);
  grunt.registerTask('clean', ['clean:all']);

};