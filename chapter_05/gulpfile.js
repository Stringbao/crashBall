// 引入 gulp及组件
var gulp=require('gulp'),  //gulp基础库
    minifycss=require('gulp-minify-css'),   //css压缩
    concat=require('gulp-concat'),   //合并文件
    uglify=require('gulp-uglify'),   //js压缩
    rename=require('gulp-rename'),   //文件重命名
    notify=require('gulp-notify');   //提示
    clean=require('gulp-clean');   //清理
 
//css处理
gulp.task('minifycss',function(){
    var arr = [
        'src/assets/css/game.css'
    ];
   return gulp.src(arr)      //设置css
       .pipe(concat('app.css'))      //合并css文件到"app.css"
       .pipe(gulp.dest('dist/assets/css'))           //设置输出路径
       .pipe(rename({suffix:'.min'}))         //修改文件名
       .pipe(minifycss())                    //压缩文件
       .pipe(gulp.dest('dist/assets/css'))            //输出文件目录
       .pipe(notify({message:'css task ok'}));   //提示成功
});

//JS处理
gulp.task('minifyjs',function(){
    var arr = [
        'src/assets/js/jquery.min.js',
        'src/core/util/GDom.js',
        'src/core/util/GIdBuilder.js',
        'src/core/util/GPoint.js',
        'src/core/util/GVector.js',
        'src/core/GFps.js',
        'src/core/GObject.js',
        'src/core/GNode.js',
        'src/core/GElement.js',
        'src/core/control/GControl.js',
        'src/core/control/GLabel.js',
        'src/core/input/GMouse.js',
        'src/core/Game.js',
        'src/chapter04/Define.js',
        'src/chapter04/Hole.js',
        'src/chapter04/Ball.js',
        'src/chapter04/BlockBall.js',
        'src/chapter04/Obstacle.js',
        'src/chapter04/Launcher.js',
        'src/chapter04/Scene.js',
    ];
   return gulp.src(arr)  //选择合并的JS
       .pipe(concat('app.js'))   //合并js
       .pipe(gulp.dest('dist/js'))         //输出
       .pipe(rename({suffix:'.min'}))     //重命名
       .pipe(uglify())                    //压缩
       .pipe(gulp.dest('dist/js'))            //输出 
       .pipe(notify({message:"js task ok"}));    //提示
});

gulp.task('clean', function () {
	return gulp.src("dist")
		.pipe(clean());
});

gulp.task('copy',  function() {
    return gulp.src(['src/**/*','!src/chapter04/**/*','!src/core/**/*'])
      .pipe(gulp.dest("dist"))
  });

gulp.task('default',function(){
    gulp.start('clean','minifycss','minifyjs',"copy");
});