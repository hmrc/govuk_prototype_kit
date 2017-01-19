/*
  copy-gov-modules.js
  ===========
  copies files for node_modules into govuk_modules
*/

var gulp = require('gulp')
var config = require('./config.json')

gulp.task('copy-toolkit', function () {
  return gulp.src(['node_modules/govuk_frontend_toolkit/**'])
  .pipe(gulp.dest(config.paths.govukModules + '/govuk_frontend_toolkit/'))
})

gulp.task('copy-template', function () {
  return gulp.src(['node_modules/govuk_template_jinja/views/layouts/**'])
  .pipe(gulp.dest(config.paths.govukModules + '/govuk_template/layouts/'))
  .pipe(gulp.dest(config.paths.lib))
})

gulp.task('copy-template-assets', function () {
  return gulp.src(['node_modules/govuk_template_jinja/assets/**'])
  .pipe(gulp.dest(config.paths.govukModules + '/govuk_template/assets/'))
})

gulp.task('copy-elements-sass', function () {
  return gulp.src(['node_modules/govuk-elements-sass/public/sass/**'])
  .pipe(gulp.dest(config.paths.govukModules + '/govuk-elements-sass/'))
})

gulp.task('copy-frontend-alpha-assets', function () {
  return gulp.src(['node_modules/govuk_frontend_alpha/assets/**'])
  .pipe(gulp.dest(config.paths.govukModules + '/govuk-frontend-alpha/'))
})

gulp.task('copy-frontend-alpha-macros', function () {
  return gulp.src(['node_modules/govuk_frontend_alpha/components/*.njk'])
  .pipe(gulp.dest(config.paths.govukModules + '/govuk-frontend-alpha/macros/'))
})
