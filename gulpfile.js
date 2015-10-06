var gulp = require("gulp");
var source = require("vinyl-source-stream");
var browserify = require("browserify");
var less = require("gulp-less");

gulp.task("browserify", function() {
  browserify("./src/js/index.jsx")
    .transform("reactify")
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("./test/js"));
});

gulp.task("less", function() {
  gulp.src([
    "./node_modules/bootstrap/fonts/glyphicons-halflings-regular.*",
    "./src/fonts/*"
  ])
    .pipe(gulp.dest("./test/fonts"));

  return gulp.src("./src/less/all.less")
    .pipe(less({
      paths: ["./node_modules/bootstrap/less/"]
    }))
    .pipe(gulp.dest("./test/css"));
});

gulp.task("watch", ["browserify", "less"], function() {
  gulp.watch(["./src/js/**/*"], ["browserify"]);
  gulp.watch(["./src/less/**/*"], ["less"]);
});

gulp.task("build", ["browserify", "less"]);
