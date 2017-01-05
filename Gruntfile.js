module.exports = function (grunt) {
  grunt.initConfig({

    // Builds Sass
    sass: {
      dev: {
        options: {
          style: "expanded",
          sourcemap: true,
          includePaths: [
            'govuk_modules/govuk_template/assets/stylesheets',
            'hmrc_modules/assets-frontend/govuk_elements/govuk/public/sass',
            'hmrc_modules/assets-frontend/govuk_frontend_toolkit/stylesheets',
            'hmrc_modules/'
          ],
          outputStyle: 'expanded'
        },
        files: [{
          expand: true,
          cwd: "app/assets/sass",
          src: ["*.scss"],
          dest: "public/stylesheets/",
          ext: ".css"
        }]
      }
    },

    postcss: {
      options: {
        processors: [
          require('autoprefixer')({browsers: ['last 2 versions', 'IE >= 8']}),
        ]
      },
      dist: {
        src: 'public/stylesheets/*.css'
      }
    },

    // Copies templates and assets from external modules and dirs
    sync: {
      assets: {
        files: [{
          expand: true,
          cwd: 'app/assets/',
          src: ['**/*', '!sass/**'],
          dest: 'public/'
        }],
        ignoreInDest: "**/stylesheets/**",
        updateAndDelete: true
      },
      hmrc: {
        files: [{
          cwd: 'node_modules/assets-frontend/assets/',
          src: [
            'scss/**',
            'govuk_elements/**',
            'govuk_frontend_static/**',
            'govuk_frontend_toolkit/**',
            'images/**'
          ],
          dest: 'hmrc_modules/assets-frontend/'
        },
        {
          cwd: 'node_modules/assets-frontend/assets/dist/javascripts',
          src: ['**'],
          dest: 'public/javascripts/assets-frontend/'
        }]
      },
      govuk: {
        files: [
          {
            cwd: 'node_modules/govuk_template_mustache/assets/',
            src: '**',
            dest: 'govuk_modules/govuk_template/assets/'
          },
          {
            cwd: 'node_modules/govuk_template_jinja/views/layouts/',
            src: '**',
            dest: 'govuk_modules/govuk_template_jinja/views/layouts/'
          }]
      },
      govuk_template_jinja: {
        files: [{
          cwd: 'govuk_modules/govuk_template_jinja/views/layouts/',
          src: '**',
          dest: 'lib/'
        }]
      }
    },

    // Watches assets and sass for changes
    watch: {
      css: {
        files: ['app/assets/sass/**/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false
        }
      },
      assets: {
        files: ['app/assets/**/*', '!app/assets/sass/**'],
        tasks: ['sync:assets'],
        options: {
          spawn: false
        }
      }
    },

    // nodemon watches for changes and restarts app
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          ext: 'js, json',
          ignore: ['node_modules/**', 'app/assets/**', 'public/**'],
          args: grunt.option.flags()
        }
      }
    },

    concurrent: {
      target: {
        tasks: ['watch', 'nodemon'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  [
    'grunt-sync',
    'grunt-contrib-watch',
    'grunt-sass',
    'grunt-postcss',
    'grunt-nodemon',
    'grunt-concurrent'
  ].forEach(function (task) {
    grunt.loadNpmTasks(task);
  });

  grunt.registerTask('generate-assets', [
    'sync',
    'sass',
    'postcss'
  ]);

  grunt.registerTask('default', [
    'generate-assets',
    'concurrent:target'
  ]);

  grunt.registerTask(
    'test',
    'default',
    function () {
      grunt.log.writeln('Test that the app runs');
    }
  );
};
