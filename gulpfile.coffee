gulp = require 'gulp'
watch = require 'gulp-watch'
concat = require 'gulp-concat'
sass = require 'gulp-ruby-sass'
slim = require 'gulp-slim'
liveReload = require 'gulp-server-livereload'
gutil = require 'gulp-util'
uglify = require 'gulp-uglify'
rename = require 'gulp-rename'
plumber = require 'gulp-plumber'

assetBase = './assets/'
assetJsBase = assetBase + 'js/'
assetSlimBase = assetBase + 'slim/'

dstBase = './public/'
dstJsBase = dstBase + 'js/'
dstHtmlBase = dstBase

gulp.task 'build_js', ->
  gulp.src [
    'bower_components/underscore/underscore-min.js'
    'bower_components/angular/angular.min.js'
    'bower_components/angular-route/angular-route.min.js'
    'bower_components/angular-resource/angular-resource.min.js'
    'bower_components/jquery/dist/jquery.min.js'
  ]
  .pipe plumber()
  .pipe concat 'libs.min.js'
  .pipe gulp.dest dstJsBase

  gulp.src [
    assetJsBase + '**/*.js'
  ]
  .pipe plumber()
  .pipe concat 'midiseq.min.js'
  .pipe uglify mangle: false
  .pipe gulp.dest dstJsBase


gulp.task 'build_slim', ->
  gulp.src assetSlimBase + '*.slim'
  .pipe plumber()
  .pipe slim pretty: true
  .pipe gulp.dest dstHtmlBase

  gulp.src assetSlimBase + 'templates/*.slim'
  .pipe plumber()
  .pipe slim pretty: true
  .pipe rename (path) ->
    path.extname = ''
  .pipe gulp.dest dstHtmlBase + '/templates'


gulp.task 'watch', ->
  watch assetJsBase + '**/*.js', ->
    gulp.start 'build_js'
  watch assetSlimBase + '**/*.slim', ->
    gulp.start 'build_slim'

gulp.task 'build', ->
  gulp.start 'build_js'
  gulp.start 'build_slim'


gulp.task 'default', [
  'watch'
]
