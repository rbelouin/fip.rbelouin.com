var gulp = require("gulp");
var source = require("vinyl-source-stream");
var env = require("common-env")();

gulp.task("configuration", function() {
  var defaults = require("./package.json").common_env;
  var config = env.getOrElseAll(defaults);

  var src = source("config.json");
  src.end(JSON.stringify(config));

  return src.pipe(gulp.dest("./prod/js"));
});

gulp.task("copy", function() {
  gulp.src("./src/img/icon.png")
    .pipe(gulp.dest("./prod/public/img/"));

  gulp.src("./src/html/index.html")
    .pipe(gulp.dest("./prod/public"));
});

gulp.task("build", ["configuration", "copy"]);
