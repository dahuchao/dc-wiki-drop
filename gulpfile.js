const gulp = require("gulp")
const gutil = require("gulp-util")
const rename = require("gulp-rename")
const exec = require("gulp-exec")
const sass = require("gulp-sass")
const browserify = require("browserify")
const babelify = require("babelify")
const source = require("vinyl-source-stream")
const browserSync = require("browser-sync").create()
const server = require("gulp-express")
const jasmine = require("gulp-jasmine")

gulp.task("img", function () {
  gulp.src("img/**/*")
    .pipe(gulp.dest("wiki/img"))
})

gulp.task("html", function () {
  gulp.src("html/**/*.html")
    .pipe(gulp.dest("wiki/html"))
  gulp.src("index.html")
    .pipe(gulp.dest("wiki"))
})

gulp.task("icones", function () {
  gulp.src("node_modules/material-design-icons/**/*.svg")
    .pipe(gulp.dest("wiki/icones"))
})

gulp.task("styles", function () {
  gulp.src("sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("wiki/"))
  //.pipe(browserSync.stream())
})

// Convertit es6 en es5 et assemble les morceaux
gulp.task("bin", function () {
  browserify({
    entries: "js/app.js",
    debug: true
  })
    .transform(babelify)
    .on("error", gutil.log)
    .bundle()
    .on("error", gutil.log)
    .pipe(source("app.js"))
    .pipe(gulp.dest("wiki"))
})

gulp.task("test", () =>
  gulp.src("spec/**/*.js")
    .pipe(jasmine())
)

// Tache de démarrage du serveur
gulp.task("fabrique", ["bin", 'styles', "icones", "html", "img"], function () {
  console.log("Fabrication de l'application")
})

// Refabrique automatiquement sur tout Chargement des sources
gulp.task("dev", function () {
  browserSync.init({
    server: {
      baseDir: "./wiki",
    }
  })
  server.run(["serveur.js"])
  gulp.watch(["index.html","html/**/*.html"], ["html"])
  gulp.watch("sass/**/*.scss", ["styles"])
  gulp.watch("js/**/*.js", ["bin", "test"])
  gulp.watch("spec/**/*.js", ["test"])
  gulp.watch("wiki/**/*").on("change", browserSync.reload)
})

// Tache de démarrage du serveur
gulp.task("start", ["fabrique"], function () {
  console.log("Lancement du serveur")
  server.run(["serveur.js"])
})

gulp.task("default", ["fabrique"])
