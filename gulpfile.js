var gulp = require("gulp");
var source = require("vinyl-source-stream");
var browserify = require("browserify");
var less = require("gulp-less");

gulp.task("browserify", function() {
  browserify("./prod/js/index.js")
    .transform("reactify")
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("./prod/public/js"));
});

gulp.task("copy", function() {
  gulp.src([
    "./node_modules/bootstrap/fonts/glyphicons-halflings-regular.*",
    "./node_modules/font-awesome/fonts/*",
    "./src/fonts/*"
  ])
    .pipe(gulp.dest("./prod/public/fonts"));

  gulp.src("./node_modules/intl/dist/Intl.min.js")
    .pipe(gulp.dest("./prod/public/js/"));

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
  gulp.watch(["./src/js/**/*"], ["browserify"]);
  gulp.watch(["./src/less/**/*"], ["less"]);
});

gulp.task("build", ["browserify", "copy", "less"]);
