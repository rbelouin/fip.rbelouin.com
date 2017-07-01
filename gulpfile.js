var gulp = require("gulp");
var source = require("vinyl-source-stream");
var eslint = require("gulp-eslint");
var less = require("gulp-less");
var env = require("common-env")();

gulp.task("configuration", function() {
  var defaults = require("./package.json").common_env;
  var config = env.getOrElseAll(defaults);

  var src = source("config.json");
  src.end(JSON.stringify(config));

  return src.pipe(gulp.dest("./prod/js"));
});

gulp.task("lint", function() {
  return gulp.src(["src/js/**/*.{js,jsx}"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task("copy", function() {
  gulp.src([
    "./node_modules/bootstrap/fonts/glyphicons-halflings-regular.*",
    "./node_modules/font-awesome/fonts/*",
    "./src/fonts/*"
  ])
    .pipe(gulp.dest("./prod/public/fonts"));

  gulp.src("./src/img/icon.png")
    .pipe(gulp.dest("./prod/public/img/"));

  gulp.src("./src/html/index.html")
    .pipe(gulp.dest("./prod/public"));
});

gulp.task("less", function() {
  return gulp.src("./src/less/all.less")
    .pipe(less({
      paths: [
        "./node_modules/bootstrap/less/",
        "./node_modules/font-awesome/less/"
      ]
    }))
    .pipe(gulp.dest("./prod/public/css"));
});

gulp.task("watch", ["build"], function() {
  gulp.watch(["./src/less/**/*"], ["less"]);
});

gulp.task("build", ["lint", "configuration", "copy", "less"]);
