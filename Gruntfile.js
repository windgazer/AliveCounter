module.exports = function(grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

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
        all: ['/libs','/node_modules']
    },
    useminPrepare: {
        html: ['Release/index.html']
    },
    usemin: {
        html: ['Release/index.html']
    },
    rev: {
        files: {
            src: ['Release/**/*.js','Release/**/*.css']
        }
    },
    sass: {
        std: {
            options: {
                style: 'compressed'
            },
            files: {
                'style/compiled/base.css':'style/sass/base.scss'
            }
        },
        dev: {
            options: {
                style: 'expanded',
                lineNumbers: true,
                debugInfo: true
            },
            files: {
                'style/compiled/base.css':'style/sass/base.scss'
            }
        }
    },
    compress: {
        main: {
            options: {
                archive: './<%=pkg.name%>-<%=pkg.version%>.zip',
                mode: 'zip'
            },
            files: [
                { expand: true, src : "**/*", cwd : "Release/" }
            ]
        }
    },
    imageEmbed: {
        dist: {
            src: [ "Release/css/compiled/base.css" ],
            dest: "Release/css/compiled/base.css",
            options: {
                deleteAfterEncoding : true
            }
        }
    },
    bumpup: {
        files: ['package.json','bower.json'],
        options: {
            normalize: true
        },
        setters: {
            uiv: function (old, releaseType, options) {
                return (++old).toString();
            }
        }
    },
    tagrelease: {
        file: 'package.json',
        commit:  true,
        message: 'Release %version%',
        prefix:  'v',
        annotate: false,
    }
  });

  // Load the plugin that provides the "uglify" task.
  //grunt.loadNpmTasks('grunt-usemin');

  // Default task(s).
  grunt.registerTask('default', ['sass:dev']);
  grunt.registerTask('release', ['sass:std','copy:release', 'useminPrepare', 'concat', 'uglify', 'usemin','clean:afterRelease']);
    grunt.registerTask('tag', function (type) {
        type = type ? type : 'patch'; // Default release type
        grunt.task.run('tagrelease'); // Tag
        grunt.task.run('bumpup:' + type); // Bump up the version
    });

};