const gulp = require('gulp')
const sass = require('gulp-sass')
const path = require('path')

// Gulp is ONLY for compiling SCSS FILES!
// node-sass is not featured enough to support
// what we need for compiling css files 😕

const SASS_CONFIG = {
  outputStyle: "compressed",
  sourceMapEmbed: true,
  sourceMapContents: true,
  includePaths: [
    root("src/@styles"),
    root("node_modules"),
  ]
}

gulp.task('styles', function() {
    gulp.src([
      './src/**/*.scss',
      '!./src/@styles/**',
    ])
        .pipe(sass(SASS_CONFIG).on('error', sass.logError))
        .pipe(gulp.dest('./src/'))
/*
    gulp.src([
      './src/@styles/global.scss',
    ])
        .pipe(sass(SASS_CONFIG).on('error', sass.logError))
        .pipe(gulp.dest('./src/public/'))*/
})

gulp.task('default', ['styles'], function() {
  gulp.watch('./src/**/*.scss',['styles'])
})

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0)
  return path.join.apply(path, [__dirname].concat(args))
}
