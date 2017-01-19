/*
  sass.js
  ===========
  compiles sass from assets folder with the govuk_modules
  also includes sourcemaps
*/

var gulp = require('gulp')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')

var config = require('./config.json')

gulp.task('sass', function () {
  return gulp.src(config.paths.assets + '/sass/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'expanded',
    includePaths: ['govuk_modules/govuk_frontend_toolkit/stylesheets',
      'govuk_modules/govuk_template/assets/stylesheets',
      'govuk_modules/govuk-elements-sass/']}).on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(config.paths.public + '/stylesheets/'))
})

gulp.task('sass-documentation', function () {
  return gulp.src(config.paths.docsAssets + '/sass/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'expanded',
    includePaths: ['govuk_modules/govuk_frontend_toolkit/stylesheets',
      'govuk_modules/govuk_template/assets/stylesheets',
      'govuk_modules/govuk-elements-sass/']}).on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(config.paths.public + '/stylesheets/'))
})

gulp.task('sass-frontend-alpha', function () {
  return gulp.src(config.paths.govukModules + '/govuk-frontend-alpha/scss/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.paths.public + '/stylesheets/'))
})
