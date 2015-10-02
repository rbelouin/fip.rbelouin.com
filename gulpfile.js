var gulp = require("gulp");
var source = require("vinyl-source-stream");
var browserify = require("browserify");

gulp.task("browserify", function() {
  browserify("./src/js/index.jsx")
    .transform("reactify")
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("./test/js"));
});
