// Initialize modules
const { src, dest, watch, series } = require('gulp'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  cssnano = require('cssnano'),
  cssimport = require('gulp-cssimport'),
  validator = require('gulp-html'),
  browsersync = require('browser-sync').create()

var options = {
  matchPattern: '*.css', // process only css
}

const htmlTask = () => {
  return src('./index.html').pipe(validator()).pipe(dest('dist/'))
}
// Css Task
function cssTask() {
  return src('src/css/styles.css', { sourcemaps: true })
    .pipe(cssimport(options))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('dist/css', { sourcemaps: '.' }))
}

// Browsersync
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.',
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: '0',
      },
    },
  })
  cb()
}
function browserSyncReload(cb) {
  browsersync.reload()
  cb()
}

// Watch Task
function watchTask() {
  watch('*.html', browserSyncReload)
  watch(['src/css/**/*.css'], series(cssTask, browserSyncReload))
}

// Default Gulp Task
exports.default = series(cssTask, htmlTask, browserSyncServe, watchTask)

// Build Gulp Task
exports.build = series(cssTask, htmlTask)
