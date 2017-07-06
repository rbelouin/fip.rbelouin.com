var gulp = require("gulp");
var source = require("vinyl-source-stream");

gulp.task("copy", function() {
  gulp.src("./src/img/icon.png")
    .pipe(gulp.dest("./prod/public/img/"));
});

gulp.task("build", ["copy"]);
