'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const sass = require('gulp-sass');
const minify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const gulpSequence = require('gulp-sequence');
const pug = require('gulp-pug');

gulp.task('clean', () =>
 	gulp.src('./dist', {
      read: false
    })
    .pipe(clean())
);

gulp.task('pug', () => {
  gulp.src('./src/pug/*.pug')
    .pipe(pug({
        pretty: true
    }))
    .pipe(gulp.dest('./dist')) 
});

gulp.task('minjs', () =>
 gulp.src('./src/js/**/*.js')
 	.pipe(babel({
  	presets: ['@babel/env']
  }))
  .pipe(minify())
  .pipe(concat('script.min.js'))
  .pipe(gulp.dest('./dist/js'))
);

gulp.task('sass', () =>
 gulp.src('./src/scss/**/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({
	    browsers: ['last 2 versions'],
	    cascade: false
		}))
		.pipe(concat('style.min.css'))
		.pipe(gulp.dest('./dist/css'))
);

gulp.task('build', gulpSequence('clean', ['pug', 'sass', 'minjs']));

gulp.task('back', () => {
  gulp.src('./src/js/**/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(minify())
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest('../public/js')) 
  gulp.src('./src/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('../public/css'))
});

gulp.task('devserver', ['build'], () => {
	browserSync.init({
    server: "./dist"
	});
    gulp.watch('./src/pug/**/*.pug', ['pug']).on('change', browserSync.reload);
    gulp.watch('./src/layout/**/*.pug', ['pug']).on('change', browserSync.reload);
    gulp.watch('./src/js/**/*.js', ['minjs']).on('change', browserSync.reload);
    gulp.watch('./src/scss/**/*.scss', ['sass']).on('change', browserSync.reload);
});

gulp.task('dev', gulpSequence('clean', 'devserver'));