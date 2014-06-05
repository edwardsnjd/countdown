module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: [
          'assets/js/bootstrap.min.js',
          'assets/js/script.js'
        ],
        dest: 'assets/js/<%= pkg.name %>.add.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'assets/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['assets/js/script.js'],
      ignores: ['**/*.min.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    less: {
      debug: {
        src: 'assets/css/styles.less',
        dest: 'assets/css/styles.css'
      }
    },
    cssmin: {
      'assets/css/styles.css': [
        'assets/css/styles.css'
      ]
    },
     watch: {
      files: ['<%= less.debug.src %>'],
      tasks: ['less']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('js', ['concat','uglify']);
  //default tasks for js files
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
  //css compilation from less and minification
  grunt.registerTask('css', ['less', 'cssmin']);

};
