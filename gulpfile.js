const gulp = require('gulp');
const clean = require('gulp-clean');
const minifycss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const changed = require('gulp-changed');
const htmlmin = require('gulp-htmlmin');
const debug = require('gulp-debug');
const imagemin = require('gulp-imagemin');
const runSequence = require('gulp-run-sequence'); // 任务同步队列
const cache = require('gulp-cache'); // 压缩修改的图片
const pngquant = require('imagemin-pngquant-gfw'); // 深度压缩png

// 添加版本号
const rev = require('gulp-rev');
const revFormat = require('gulp-rev-format');
const revCollector = require('gulp-rev-collector');

const htmlminOptions = {
  removeComments: true, //清除HTML注释
  collapseWhitespace: true, //压缩HTML
  collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
  removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
  removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
  removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
  minifyJS: true, //压缩页面JS
  minifyCSS: true //压缩页面CSS
};

/*=====================copy-js==========================*/
gulp.task('copy-jslib', function() {
  return gulp.src('src/js/lib/**/*').pipe(gulp.dest('dist/js/lib/'));
});

/*=====================copy静态文件==========================*/
gulp.task('copy', function() {
  gulp.start('copy-jslib');
});

/*=====================清除dist==========================*/
gulp.task('clean', function() {
  return gulp
    .src('./dist')
    .pipe(clean());
});

/*=====================压缩html==========================*/
gulp.task('html', function() {
  let srcHtml = 'src/pages/**/*.html';
  let destHtml = 'dist/pages';
  return gulp
    .src(srcHtml)
    .pipe(changed(srcHtml, { extension: '.html' }))
    .pipe(debug({ title: '【html编译】：' }))
    .pipe(htmlmin(htmlminOptions))
    .pipe(gulp.dest(destHtml));
});

/*=====================压缩css==========================*/
gulp.task('css', function() {
  let srcCss = 'src/css/**/*.css';
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

/*=====================压缩图片==========================*/
gulp.task('img', function() {
  gulp.src('src/img/*.{png,jpg,gif,ico}')
    .pipe(cache(imagemin({
      optimizationLevel: 4,
      progressive: true, // 默认：false 无损压缩jpg
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'));
});

/*=====================压缩js==========================*/
gulp.task('js', function() {
  let srcpath = 'src/js/**/*.js';
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
        compress: true,
        mangle: { except: ['requirejs', 'require', 'exports', 'module', '$'] } //排除混淆关键字
      }).on('error', function(e) {
        console.log(e);
      })
    )
    .pipe(gulp.dest(destpath));
});

/*=====================生成版本号清单==========================*/
gulp.task('rev', function() {
  return gulp.src(['dist/css/**/*.css', 'dist/js/**/*.js', '!dist/js/lib/*.js'])
    .pipe(debug({ title: '【生成版本文件】：' }))
    .pipe(rev())
    .pipe(revFormat({
      prefix: '.', // 在版本号前增加字符
      suffix: '.cache', // 在版本号后增加字符
      lastExt: true
    }))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/config/'));
});

/*=====================路径替换==========================*/
gulp.task('version', function() {
  return gulp.src(['dist/config/*.json', 'dist/**/*.html'])
    .pipe(debug({ title: '【添加版本号】：' }))
    .pipe(revCollector()) // 根据manifest.json进行文件的替换
    .pipe(gulp.dest('dist/'));
});

/*=====================上线打包==========================*/
gulp.task('build', function(done) {
  runSequence(
    ['clean'],  // 1.清空dist目录
    ['copy'],   // 2.copy静态资源
    ['html', 'img', 'css', 'js'], // 3.打包文件
    ['rev'],     // 4.生成版本
    ['version'], // 5.打版本
    done
  );
});

/*=====================文件打包==========================*/
gulp.task('default', function() {
  gulp.start('html', 'img', 'css', 'js');
});
