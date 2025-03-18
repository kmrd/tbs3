// Include gulp
import gulp from 'gulp';

// Include Our Plugins
import jshint from 'gulp-jshint';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import autoprefixer from 'gulp-autoprefixer';
import file from 'gulp-file';
import log from 'fancy-log';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

gulp.task('lint', function () {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('sass', gulp.series(
  function cssVendor() {
    return gulp.src('src/css/vendor/*.css')
      .pipe(gulp.dest('build/css/vendor'));
  },
  function scssParse() {
    return gulp.src('src/css/*.scss')
      .pipe(sass())
      .pipe(autoprefixer({
        cascade: false
      }))
      .pipe(gulp.dest('build/css'));
  }
)
);

gulp.task('scripts', gulp.series(
  function JSVendor() {
    return gulp.src('src/js/vendor/*.js')
      .pipe(gulp.dest('build/js/vendor'));
  },
  function JSParse() {
    return gulp.src('src/js/*.js')
      .pipe(concat('all.js'))
      .pipe(uglify({ /* options */ }))
      .pipe(gulp.dest('build/js'))
  }
)
);

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
