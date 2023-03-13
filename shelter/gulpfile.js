const {src, dest, series, watch, task} = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat')
const autoprefix = require('gulp-autoprefixer')
const csso = require('gulp-csso')
const include = require('gulp-file-include')
// import {deleteAsync} from 'del';

const htmlmin = require('gulp-htmlmin')
const sync = require('browser-sync').create()
const imagemin = require('gulp-imagemin');


function img () {
    return src('src/assets/**/*.{jpg,png,gif,svg}')
      .pipe(imagemin())
      .pipe(dest('dist'));
}

function html() {
    return src('src/pages/**/*.html')
    .pipe(dest('dist'))
}

function scss() {
    return src('src/pages/**/*.scss')
    .pipe(sass())
    .pipe(autoprefix())
    .pipe(csso())
    .pipe(concat('style.css'))
    .pipe(dest('dist'))
}

function serve() {
    sync.init(
        {
            server: './dist'
        }
    )
    watch('src/pages/**/*.html', series(html)).on('all', sync.reload)
    watch('src/pages/**/*.scss', series(scss)).on('all', sync.reload)

}
exports.build = series(scss, html, img)
exports.serve = series(scss, html, img, serve)