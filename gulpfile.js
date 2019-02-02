// Подключаем Gulp
var gulp = require("gulp"); 

// Создаем простой таск
gulp.task('myFirstTask', function() {
 console.log('Привет, я твой первый таск!');
});

// Запуск тасков по умолчанию
gulp.task("default", ["myFirstTask"]);