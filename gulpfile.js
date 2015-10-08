var gulp = require("gulp");
var source = require("vinyl-source-stream");
var browserify = require("browserify");
var less = require("gulp-less");

gulp.task("browserify", function() {
  browserify("./test/index.js")
    .transform("reactify")
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("./test/public/js"));
});

gulp.task("copy", function() {
  gulp.src([
    "./node_modules/bootstrap/fonts/glyphicons-halflings-regular.*",
    "./src/fonts/*"
  ])
    .pipe(gulp.dest("./test/public/fonts"));

  gulp.src("./node_modules/intl/dist/Intl.min.js")
    .pipe(gulp.dest("./test/public/js/"));

  gulp.src("./src/img/icon.png")
    .pipe(gulp.dest("./test/public/img/"));

  gulp.src("./src/html/index.html")
    .pipe(gulp.dest("./test/public"));
});

gulp.task("less", function() {
  return gulp.src("./src/less/all.less")
    .pipe(less({
      paths: ["./node_modules/bootstrap/less/"]
    }))
    .pipe(gulp.dest("./test/public/css"));
});

gulp.task("watch", ["build"], function() {
  gulp.watch(["./src/js/**/*"], ["browserify"]);
  gulp.watch(["./src/less/**/*"], ["less"]);
});

gulp.task("build", ["browserify", "copy", "less"]);
