const {src, dest, series, watch} = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat')
const autoprefix = require('gulp-autoprefixer')
const csso = require('gulp-csso')
const include = require('gulp-file-include')
// import {deleteAsync} from 'del';

const htmlmin = require('gulp-htmlmin')
const sync = require('browser-sync').create()
const imagemin = require('gulp-imagemin');
const json = require('gulp-json-transform');


function js (){
    return src('src/pages/*.js')
    .pipe(dest('dist'));
}

function jsons () {
  return src('src/assets/*.json')
    .pipe(dest('dist'));
}

function img () {
    return src(['src/assets/images/*.{jpg,png,gif,svg}', 'src/assets/icons/*.{jpg,png,gif,svg}'])
      .pipe(imagemin())
      .pipe(dest('dist/images'));
}

function html() {
    return src('src/pages/*.html')
    .pipe(dest('dist'))
    .pipe(src('src/pages/pets/*.html'))
    .pipe(dest('dist/pets'))
}

function scss() {
    return src(['src/pages/*.scss', 'src/pages/pets/*.scss'])
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
    watch(['src/pages/*.html', 'src/pages/pets/*.html'], series(html)).on('all', sync.reload)
    watch(['src/pages/*.scss', 'src/pages/pets/*.scss'], series(scss)).on('all', sync.reload)
    watch(['src/pages/*.js', 'src/pages/pets/*.js'], series(js)).on('all', sync.reload)

}




exports.build = series(scss, html, img, js, jsons)
exports.serve = series(scss, html, img, js, serve)