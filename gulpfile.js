const concat = require('gulp-concat');
const replace = require('gulp-replace');
const gulp = require('gulp');

gulp.task('default', function() {
  return gulp.src(['./constants.js', './move.js', './heuristic.js', './board.js', './ai.js', './minimax.js'])
    .pipe(concat('final.js'))
    .pipe(replace(/module.exports[^\n]*/g, ''))
    .pipe(replace(/.* = require\([^\n]*/g, ''))
    .pipe(gulp.dest('./dist/'));
});
