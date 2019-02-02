// Подключаем плагины Gulp
// Перед использованием прописать плагины в package.jsongulp bkb дать команду: 
// npm i gulp-sass gulp-cssnano gulp-autoprefixer gulp-imagemin gulp-concat gulp-uglify gulp-rename --save-dev
const gulp = 		require('gulp'),
	sass = 			require("gulp-sass"), 			// переводит SASS в CSS
	cssnano = 		require("gulp-cssnano"), 		// Минимизация CSS
	autoprefixer = 	require('gulp-autoprefixer'), 	// Проставлет вендорные префиксы в CSS для поддержки старых браузеров
	imagemin = 		require('gulp-imagemin'), 		// Сжатие изображений
	concat = 		require("gulp-concat"), 		// Объединение файлов - конкатенация
	uglify = 		require("gulp-uglify"), 		// Минимизация javascript
	del = 			require('del');					// Отчистка неиспользуемых файлов
	concatCss = 	require('gulp-concat-css');
	browserSync = 	require('browser-sync'),
	rename = 		require("gulp-rename"); 		// Переименование файлов

const scssFiles = 'src/scss/**/*.scss';
const htmlFiles = 'src/*.html';

const jsFiles = [
	'src/bower_components/jquery/dist/jquery.min.js',
	'src/bower_components/jq-router/dist/jq-router.min.js',
	'src/js/**/*.js'
];
const libsCssFiles = [];

/* --------------------------------------------------------
		Таски для Gulp
------------------------------------------------------------ */

// Копирование файлов HTML в папку dist
gulp.task("html", function() {
    return gulp.src(htmlFiles)
    .pipe(gulp.dest("dist"));
});

// Объединение, компиляция Sass в CSS, простановка венд. префиксов и дальнейшая минимизация кода
gulp.task("sass", function() {
    return gulp.src(scssFiles)
        // .pipe(concat('styles.scss'))
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
         }))
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest("dist/css"))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// Объединение и сжатие JS-файлов
gulp.task("scripts", function() {
    return gulp.src(jsFiles) 			// директория откуда брать исходники
        .pipe(concat('scripts.js')) 	// объеденим все js-файлы в один 
        .pipe(uglify()) 				// вызов плагина uglify - сжатие кода
        .pipe(rename({ suffix: '.min' })) // вызов плагина rename - переименование файла с приставкой .min
		.pipe(gulp.dest("dist/js")) 	// директория продакшена, т.е. куда сложить готовый файл
		.pipe(browserSync.reload({		// перезагрузка браузера после изменения кода
			stream: true
		}))
});

// Сжимаем картинки
gulp.task('imgs', function() {
    return gulp.src("src/img/**/*.+(jpg|jpeg|png|gif)")
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true
        }))
        .pipe(gulp.dest("dist/img"))
});

gulp.task('fonts', () => {
	return gulp.src('src/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))
})

gulp.task('css', () => {
	return gulp.src(libsCssFiles)
		.pipe(concatCss('libs.css'))
		.pipe(cssnano())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('browserSync', () => {
	browserSync.init({
		server: {
				baseDir: ['./', './src']
		}
	});
});

gulp.task('clean', () => {
	del(['dist/**/*', '!dist/images', '!dist/images/**/*']);
})


// Задача слежения за измененными файлами
gulp.task('watch', ['browserSync'], () => {
	gulp.watch(htmlFiles, ["html"]);
	gulp.watch(scssFiles, ['sass']);
	gulp.watch(jsFiles, ['scripts']);
	gulp.watch('index.html', browserSync.reload);
    // gulp.watch("src/images/*.+(jpg|jpeg|png|gif)", ["imgs"]); // второй вариант

})

// ---- Таски ------------------------------------
	gulp.task('build', ['clean'], () => {
		gulp.start('html', 'sass', 'scripts', 'css', 'imgs', 'fonts', "watch");
	})

// Запуск тасков по умолчанию
gulp.task("default", ["build"]);