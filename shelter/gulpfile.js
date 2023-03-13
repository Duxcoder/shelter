const {src, dest, series, watch} = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat')
const autoprefix = require('gulp-autoprefixer')
const csso = require('gulp-csso')
const include = require('gulp-file-include')
// import {deleteAsync} from 'del';

const htmlmin = require('gulp-htmlmin')
const sync = require('browser-sync').create()

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

    watch('src/pages/**/*.html', series(html)).on('change', sync.reload)
    watch('src/pages/**/*.scss', series(scss)).on('change', sync.reload)

}
exports.build = series(scss, html)
exports.serve = series(scss, html, serve)