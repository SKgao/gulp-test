let gulp = require('gulp');
let minifycss = require('gulp-minify-css');
let uglify = require('gulp-uglify');
let babel = require('gulp-babel');
let changed = require('gulp-changed');
let htmlmin = require('gulp-htmlmin');
let debug = require('gulp-debug');

let htmlminOptions = {
  removeComments: true, //清除HTML注释
  collapseWhitespace: true, //压缩HTML
  collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
  removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
  removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
  removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
  minifyJS: true, //压缩页面JS
  minifyCSS: true //压缩页面CSS
};

gulp.task('copy-jslib', function() {
  return gulp.src('src/js/lib/**/*').pipe(gulp.dest('dist/js/lib/'));
});

gulp.task('copy-img', function() {
  return gulp.src('src/img/**/*').pipe(gulp.dest('dist/img/'));
});

gulp.task('copy', function() {
  gulp.start('copy-img', 'copy-jslib');
});

// 压缩html
gulp.task('html', function() {
  let srcHtml = 'src/pages/*.html';
  let destHtml = 'dist/pages';
  return gulp
    .src(srcHtml)
    .pipe(changed(srcHtml, { extension: '.html' }))
    .pipe(debug({ title: '【html编译】：' }))
    .pipe(htmlmin(htmlminOptions))
    .pipe(gulp.dest(destHtml));
});

// 压缩css
gulp.task('css', function() {
  let srcCss = 'src/css/*.css';
  let destCss = 'dist/css';
  return (
    gulp
      .src(srcCss)
      .pipe(changed(destCss, { extension: '.css' }))
      .pipe(minifycss())
      .pipe(debug({ title: '【css编译】：' }))
      .pipe(gulp.dest(destCss))
  );
});

// 压缩js
gulp.task('js', function() {
  let srcpath = 'src/js/*.js';
  let destpath = 'dist/js/';
  return gulp
    .src(srcpath)
    .pipe(changed(srcpath, { extension: '.js' }))
    .pipe(debug({ title: '【js-app编译】：' }))
    .pipe(
      babel({
　　　　presets: ['env']
　　　})
    )
    .pipe(
      uglify({
        mangle: { except: ['requirejs', 'require', 'exports', 'module', '$'] } //排除混淆关键字
      }).on('error', function(e) {
        console.log(e);
      })
    )
    .pipe(gulp.dest(destpath));
});

gulp.task('default', function() {
  gulp.start('copy', 'html', 'css', 'js');
});
