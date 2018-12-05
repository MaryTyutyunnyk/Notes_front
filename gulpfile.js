'use strict';

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const clean = require('gulp-clean');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const runSequence = require('run-sequence');
const pug = require('gulp-pug');

const path = {
    dist:{
        server:         './dist',
        css:            './dist/css',
    },
    src:{
        scss:           './src/scss/main.scss',
        scss_modules:   './src/scss/modules/**/*.scss',
        pug:            './src/pug/newToDoList.pug',
    },
    watch:{
        style:          'src/scss/**/*.scss',
        pug:            'src/pug/**/*.pug',
        layout:         'src/layout/**/*.pug'
    }
};

gulp.task('pug', function () {
    return gulp.src(path.src.pug)
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(path.dist.server)); // указываем gulp куда положить скомпилированные HTML файлы
});

gulp.task('css', function () {
    return gulp.src(path.src.scss)
        .pipe(plumber()) // Отслеживание ошибок
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'expanded' // Добавление отступов между классами в итоговых стилях
        }))
        .pipe(autoprefixer({ // Добавление префиксов
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(rename("main.css")) // Изменение название с расширением css
        .pipe(gulp.dest(path.dist.css))
        .pipe(cssnano({ // Сжатие css файла
            zindex: false
        }))
        .pipe(rename({ suffix: '.min' })) // Добавление к css файлу суфикса min
        .pipe(gulp.dest(path.dist.css));
});

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('build', function () {
    runSequence('clean', ['pug', 'css']);
});

gulp.task('dev', function (){
    runSequence('clean', ['pug', 'css'], function(){ // выполняет указанные таски по очереди
        browserSync.init({
            server: path.dist.server
        });
        gulp.watch(path.watch.style,['css']).on('change', browserSync.reload);
        gulp.watch(path.watch.pug, ['pug']).on('change', browserSync.reload);
        gulp.watch(path.watch.layout, ['pug']).on('change', browserSync.reload);
    })
});
