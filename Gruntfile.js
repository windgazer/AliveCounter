module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    usemin: {
      html: ['index.html'],
      css: ['*/*.css'],
      options: {
        dirs: ['temp', 'dist']
      }
    },
    bower: {
      install: {
         //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
      }
    },
  });

  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-bower-task');

  // Default task(s).
  //grunt.registerTask('install', ['bower:install']);

};