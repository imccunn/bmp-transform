'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jscs');

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      dev: {
        src: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js', 'index.js']
      }
    },
    jscs: {
      main: ['lib/**/*.js']
    },
    simplemocha: {
      all: {
        src: ['test/**/*.js']
      }
    },
    watch: {
      scripts: {
        files: ['lib/**/*.js', 'test/*.js'],
        tasks: ['jshint']
      }
    }
  });

  grunt.registerTask('test', ['jshint', 'simplemocha']);
  grunt.registerTask('default', ['test']);
};
