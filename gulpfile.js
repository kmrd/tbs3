const gulp = require('gulp');
const rename = require('gulp-rename');
// const less = require('gulp-less');
const sass = require('gulp-sass');
const del = require('del');


// const pug = require('gulp-pug');
const minifyCSS = require('gulp-csso');
// const imagemin = require('gulp-imagemin');
// const concat = require('gulp-concat');
// const sourcemaps = require('gulp-sourcemaps');

// gulp.task('html', function(){
//   return gulp.src('client/templates/*.pug')
//     .pipe(pug())
//     .pipe(gulp.dest('build/html'))
// });


// imagemin(['images/*.{jpg}'], 'images', {
//     use: [
//         imageminWebp({quality: 60})
//     ]
// }).then(() => {
//     console.log('Images optimized');
// });

var env = 'development';

gulp.task('start', function() {
  // env = 'development';
  gulp.watch('src/css/*',  gulp.series('build-scss') );
  gulp.watch('src/css/*',  gulp.series('build-css') );
  gulp.watch('src/js/*',   gulp.series('build-js') );
  gulp.watch('src/imgs/*', gulp.series('build-imgs') );
  gulp.watch('src/*',      gulp.series('build-html') );
});


// Not working -- async issues have to be addressed:
// this is probably not the way this should be done
gulp.task('build', function(done) {
  env = 'production';
  gulp.series('build-scss');
  gulp.series('build-css');
  gulp.series('build-js');
  gulp.series('build-imgs');
  gulp.series('build-html');
  return done();
});


gulp.task('build-scss', (done) => {
  let stream = gulp
    .src('src/css/*.scss')
    .pipe( sass().on('error', sass.logError) );

  // This doesn't work as expected. Need to troubleshoot
  if ( env == 'production') {
    stream.pipe(minifyCSS());
  }

  return stream.pipe(gulp.dest('build/css'));
});

gulp.task('build-css', function(){
  return gulp.src('src/css/*.css')
    // .pipe( sass().on('error', sass.logError) )
    // .pipe(minifyCSS())
    .pipe(gulp.dest('build/css'))
});

gulp.task('build-js', function(){
  return gulp.src('src/js/*')
    // .pipe(less())
    // .pipe(minifyCSS())
    .pipe(gulp.dest('build/js'))
});

gulp.task('build-imgs', function(){
  del(['build/imgs/*']);
  // gulp.series('copy_imgs');
  return gulp.src('src/imgs/*')
    // .pipe(imagemin( {
    // }))
    // .pipe(less())
    // .pipe(minifyCSS())
    .pipe(gulp.dest('build/imgs'))
});

gulp.task('copy_imgs', function(){
  return gulp.src('src/imgs/*.{png,svg}')
    // .pipe(less())
    // .pipe(minifyCSS())
    .pipe(gulp.dest('build/imgs'))
});


gulp.task('build-html', function(){
  return gulp.src('src/*.html')
    // .pipe(less())
    // .pipe(minifyCSS())
    .pipe(gulp.dest('build'))
});

// gulp.watch('src/*', ['build-html']);

// gulp.task('js', function(){
//   return gulp.src('client/javascript/*.js')
//     .pipe(sourcemaps.init())
//     .pipe(concat('app.min.js'))
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest('build/js'))
// });

// gulp.task('default', [ 'html', 'css', 'js' ]);


// var gulp        = require('gulp');
// var handlebars  = require('gulp-compile-handlebars');
// var rename      = require('gulp-rename');

// gulp.task('start', function() {
//   gulp.watch('src/*', ['build']);
//   gulp.watch('templates/*', ['build']);
// });

// gulp.task('build', function(){
//   var templateData = {
//     // firstName: 'Kaanon'
//   },
//   options = {
//     // ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false
//     partials : {
//       // footer : '<footer>the end</footer>'
//     },
//     batch : ['./templates/'],
//     helpers : {
//       unescape : function(str){
//         return str.replace(/&amp;/g, '&');//toUpperCase();
//       },
//       // breaklines : function(str) {
//       //   str = handlebars.Utils.escapeExpression(str);
//       //   str = str.replace(/(\r\n|\n|\r)/gm, '<br>');
//       //   return new Handlebars.SafeString(str);
//       // }
//     }
//   }

//   return gulp.src('src/*')
//     .pipe(handlebars(templateData, options))
//     .pipe(rename( {
//       extname: ".html"
//     }))
//     .pipe(gulp.dest('build'));
// });
