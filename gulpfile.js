// gulp.src() //读文件
// gulp.dest()//写文件
// gulp.task()//任务
// gulp.watch()//监听


var gulp = require("gulp");
var htmlClean = require("gulp-htmlclean") //压缩HTML的插件
var imgMin = require("gulp-imagemin") //压缩图片
var uglify = require("gulp-uglify") //压缩js
var stripDebug = require("gulp-strip-debug") //去掉调试语句
var concat = require("gulp-concat") // 将所有js文件拼接成一个js
var less = require("gulp-less") //将less文件转换成css
var postcss = require("gulp-postcss") //自动添加css3样式前缀和压缩代码
var autoprefixer = require("autoprefixer") //添加前缀
var cssnano = require("cssnano") //压缩css代码
var connect = require("gulp-connect") //开启简易模拟服务器
// var express = require('express')
// var path = require('path')
// var app = express()
//     app.use(express.static(path.join(__dirname, 'src'))); 

//开发环境和生产环境的判断
//开发环境：不压缩代码,不去掉调试语句
// console.log(process.env.NODE_ENV == "production")//  生产模式
var devMode = process.env.NODE_ENV == "development" //  开发模式
console.log(devMode);

//以对象形式获取路径
var folder = {
    src: "src/", //开发目录文件夹
    dist: "dist/" //压缩打包后的目录文件夹
}

//创建任务
gulp.task("html", function() {
    var page = gulp.src(folder.src + "html/*") //流文件
        .pipe(connect.reload())
    if (!devMode) {
        page.pipe(htmlClean()) //通过调用htmlclean插件压缩html
    }
    page.pipe(gulp.dest(folder.dist + "html/")) //通过pipe运输到目的文件夹
})

gulp.task("imgs", function() {
    gulp.src(folder.src + "imgs/*")
        .pipe(imgMin()) //压缩图片
        .pipe(gulp.dest(folder.dist + "imgs/"))
})

gulp.task("js", function() {
    var page = gulp.src(folder.src + "js/*")
        .pipe(connect.reload())
    if (!devMode) {
        page.pipe(stripDebug()) //去掉调试语句
        // page.pipe(concat("main.js")) //将所有src里的js文件拼接成一个放在main.js下
        page.pipe(uglify()) //压缩js
    }
    page.pipe(gulp.dest(folder.dist + "js/"))
})

gulp.task("css", function() {
    var opitions = [autoprefixer(), cssnano()]; //将添加前缀和压缩代码方法存在数组里，方便调用
    var page = gulp.src(folder.src + "css/*")
        .pipe(connect.reload())
        .pipe(less()) //将less文件转换成css
    if (!devMode) {
        page.pipe(postcss(opitions)) //调用同时压缩代码、添加前缀功能
    }
    page.pipe(gulp.dest(folder.dist + "css/"))
})


//监听 (src文件有变化时，dist文件随之改变)
gulp.task("watch", function() {
    gulp.watch(folder.src + "html/*", ["html"])
    gulp.watch(folder.src + "css/*", ["css"])
    gulp.watch(folder.src + "js/*", ["js"])
    gulp.watch(folder.src + "imgs/*", ["imgs"])
})

//开启模拟服务器
gulp.task("server", function() {
    connect.server({
        port: "8090", //手动修改端口号
        livereload: true, //浏览器自动刷新
    })
})
//执行任务
gulp.task("default", ["html", "imgs", "js", "css", "watch", "server"])