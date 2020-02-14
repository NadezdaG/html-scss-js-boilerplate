// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');

// browsersync setup 
const browserSync= require('browser-sync');
const server = browserSync.create();

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: './'
    }
  });
  done();
}
// end

var replace = require('gulp-replace');


function browsersync () {
     bs.init({
        server: {
            baseDir: "./dist/"
        },
         proxy: "localhost:8080"
    });   
}


// File paths
const files = { 
    scssPath: 'src/scss/**/*.scss',
    jsPath: 'src/js/**/*.js',
    htmlPath: 'src/**/*.html',
    imagePath: 'src/images/*'
}

// Sass task: compiles the style.scss file into style.css
function scssTask(){    
    return src(files.scssPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass()) // compile SCSS to CSS
        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest('dist/css')
    ); // put final CSS in dist folder
}


// Image minification
function imgSquash() {
		return src(files.imagePath)
		.pipe(imagemin())
		.pipe(webp())
		.pipe(dest("dist/images"));
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask(){
    return src([
        'src/js/vendor/*.js',
        'src/js/*.js'
        //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
        ])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(dest('dist/js')
    );
}

// Gulp task to minify HTML files
function htmlTask() {
	  return src([files.htmlPath])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(dest('./dist'));
};

// Cachebust
var cbString = new Date().getTime();
function cacheBustTask(){
    return src(['dist/index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest('.'));
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask(){
    watch([files.scssPath, files.jsPath, files.htmlPath, files.imagePath], 
        series(
            parallel(scssTask, jsTask, htmlTask, imgSquash),
            cacheBustTask, reload
        )
    );    
}

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(
    parallel(scssTask, jsTask, htmlTask,imgSquash), 
    cacheBustTask,serve,
    watchTask
);