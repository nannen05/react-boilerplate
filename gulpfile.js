var gulp = require('gulp'),
	  connect = require('gulp-connect'),
	  livereload = require('gulp-livereload'),
	  compass = require('gulp-compass'),
	  gutil = require('gulp-util'),
	  browserify = require('browserify'),
	  babelify = require('babelify'),
	  source = require('vinyl-source-stream');


var sassSources = ['styles/scss/*.scss'],
    sassStyle = 'expanded';

gulp.task('compass', function(){
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'styles/scss',
			style: sassStyle
		}))
		.on('error', gutil.log)
		.pipe(gulp.dest('styles/css'))
		.pipe(connect.reload())
		.pipe(livereload());
});

gulp.task('html', function() {
	gulp.src('*.html')
		.pipe(connect.reload())
});

gulp.task('js', function () {
  browserify({
    entries: 'index.js',
    extensions: ['.js'],
    debug: true
  })
  .transform(babelify.configure({
    presets: ["es2015", "react"]
  }))
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./dist'))
  .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(['*.html'], ['html']);
  gulp.watch('styles/scss/*.scss', ['compass'])
  gulp.watch('components/*.js', ['js']);
  gulp.watch('*.js', ['js']);
});

gulp.task('connect', function() {
  connect.server({
    root:  __dirname,
    livereload: true,
    port: 1234
  })
})

gulp.task('default', ['html','js', 'compass', 'connect', 'watch'])
