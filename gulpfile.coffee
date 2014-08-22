# Load all required libraries.
gulp = require 'gulp'
gutil = require 'gulp-util'
coffee = require 'gulp-coffee'
istanbul = require 'gulp-istanbul'
mocha = require 'gulp-mocha'
rimraf = require 'rimraf'

gulp.task 'clean', ->
  rimraf.sync('lib')

gulp.task 'coffee', ->
  gulp.src './src/**/*.coffee'
    .pipe coffee({bare: true}).on('error', gutil.log)
    .pipe gulp.dest './lib/'

gulp.task 'js', ->
  gulp.src './src/**/*.js'
    .pipe gulp.dest './lib/'

gulp.task 'build', ['clean', 'js', 'coffee']

gulp.task 'test', ['build'], ->
  gulp.src ['lib/**/*.js']
    .pipe(istanbul()) # Covering files
    .on 'finish', ->
      gulp.src(['test/**/*.spec.coffee'])
        .pipe mocha reporter: 'spec', compilers: 'coffee:coffee-script'
        .pipe istanbul.writeReports() # Creating the reports after tests run

gulp.task 'default', ['build']
