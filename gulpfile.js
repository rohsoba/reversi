const gulp = require('gulp');
const babel = require('gulp-babel');
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const pug = require('gulp-pug');
const browserSync = require("browser-sync");

gulp.task('pug', () => {
    return gulp.src('src/*.pug')
        .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('sass', () => {
    return gulp.src('src/*.sass')
        .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist'));
});

gulp.task('babel', () => {
    return gulp.src('src/*.js')
        .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('browser-sync', () => {
    browserSync({
        server: {
            baseDir: "./dist/"
        }
    });

    gulp.watch('./dist/*.js', gulp.series('reload'));
    gulp.watch('./dist/*.css', gulp.series('reload'));
    gulp.watch('./dist/*.html', gulp.series('reload'));
});

gulp.task('reload', () => {
    browserSync.reload();
});

gulp.task('watch', () => {
    gulp.watch('src/*.js', gulp.series('babel'));
    gulp.watch('src/*.sass', gulp.series('sass'));
    gulp.watch('src/*.pug', gulp.series('pug'));
});

gulp.task('default', gulp.parallel('browser-sync', 'watch'));
