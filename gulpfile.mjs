// Include gulp
import gulp from 'gulp';

// Include Our Plugins
import jshint from 'gulp-jshint';
import autoprefixer from 'gulp-autoprefixer';
import importCss from 'gulp-import-css';
import file from 'gulp-file';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import webpackstream from 'webpack-stream';
import webpack from 'webpack';

const sass = gulpSass(dartSass);

gulp.task('lint', function () {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('sass', gulp.series(
  function scssParse() {
    return gulp.src('src/css/*.scss')
      .pipe(sass())
      .pipe(importCss())
      .pipe(autoprefixer({
        cascade: false
      }))
      .pipe(gulp.dest('build/css'));
  }
));

gulp.task('scripts', gulp.series(
  function JSParse() {
    return gulp.src('src/js/*.js')
      .pipe(webpackstream({
        mode: 'development',
        output: {
          filename: 'all.js',
        }
      },
        webpack,
      ))
      .pipe(gulp.dest('build/js'))
  }
));

gulp.task('html', function (done) {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('build'));
});


gulp.task('rootassets', function () {
  return gulp.src(['src/*', '!src/*.html', '!src/touch'], { encoding: false })
    .pipe(gulp.dest('build'));
});

gulp.task('imgs', function () {
  return gulp.src('src/imgs/*', { encoding: false })
    .pipe(gulp.dest('build/imgs'));
});

gulp.task('touch', function touch() {
  return file('touch', String(new Date().getTime()), { src: true })
    .pipe(gulp.dest('build'));
});

// Watch Files For Changes
gulp.task('watch', function () {
  gulp.watch('src/js/*.js', gulp.series(/*'lint',*/ 'scripts', 'touch'));
  gulp.watch('src/css/*.scss', gulp.series('sass', 'touch'));
  gulp.watch('src/imgs/*', gulp.series('imgs', 'touch'));
  gulp.watch(['src/*', '!src/*.html'], gulp.series('rootassets', 'touch'));
  gulp.watch(['src/*.html', 'src/_templates/*'], gulp.series('html', 'touch'));
});

// Default Task
gulp.task('default',
  gulp.series(
    // 'lint',
    'sass',
    'scripts',
    'imgs',
    'rootassets',
    'html',
    'touch',
    'watch')
);
