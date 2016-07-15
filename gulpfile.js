var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var exec = require('gulp-exec');
var sass = require('gulp-sass');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync').create();
var server = require('gulp-express');

gulp.task('img', function() {
  gulp.src("img/**/*")
    .pipe(gulp.dest('wiki2/img'))
});

gulp.task('html', function() {
  gulp.src("html/**/*.html")
    .pipe(gulp.dest('wiki2/html'))
});

gulp.task('icones', function() {
  gulp.src("node_modules/material-design-icons/**/*.svg")
    .pipe(gulp.dest('wiki2/icones'))
});

gulp.task('styles', function() {
  gulp.src('sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('wiki2/'))
    .pipe(browserSync.stream());
});

// Convertit es6 en es5 et assemble les morceaux
gulp.task("fabrique", function() {
  browserify({
      entries: "js/app.js",
      debug: true
    })
    .transform(babelify)
    .on("error", gutil.log)
    .bundle()
    .on("error", gutil.log)
    .pipe(source("app.js"))
    .pipe(gulp.dest("wiki2"));
});

// Refabrique automatiquement sur tout Chargement des sources
gulp.task('dev', ['fabrique', 'styles'], function() {
  browserSync.init({
    server: {
      baseDir: ".",
    }
  });
  gulp.watch("html/**/*.html", ["html"])
  gulp.watch("js/**/*.js", ["fabrique"])
  gulp.watch("sass/**/*.scss", ["styles"])
  gulp.watch("wiki2/**/*").on("change", browserSync.reload);
  //server.run(['serveur.js']);
});

// Tache de démarrage du serveur
gulp.task('start', ["fabrique", 'styles', "icones", "html", "img"], function() {
  console.log('Lancement du serveur');
  server.run(['serveur.js']);
});

gulp.task('default', ['dev']);
