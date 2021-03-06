
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')

var index = require('./routes/index');
var all_courses = require('./routes/all_courses');
var course = require('./routes/course');
var category = require('./routes/category');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('IxD secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', index.view);
app.get('/catData', index.getData);
app.post('/catData', index.postData);

app.get("/:username/all_courses", all_courses.view);

app.get("/:username/all_courses/catData", all_courses.getData);
app.post("/:username/all_courses/catData", all_courses.postData);

app.post("/:username/all_courses/delData", all_courses.delData);
app.post("/:username/all_courses/editData", all_courses.editData);



app.get("/:username/all_courses/course/:course_name", course.viewCourse);
app.post("/:username/all_courses/course/:course_name", course.postLetterGrade);

app.get("/:username/all_courses/course/:course_name/catData", course.getData);
app.post("/:username/all_courses/course/:course_name/catData", course.postData);

app.post("/:username/all_courses/course/:course_name/delData", course.delData);
app.post("/:username/all_courses/course/:course_name/editData", course.editData);



app.get("/:username/all_courses/course/:course_name/category/:category_name", category.viewCategory);
app.post("/:username/all_courses/course/:course_name/category/:category_name", category.postUpdated);

app.get("/:username/all_courses/course/:course_name/category/:category_name/catData", category.getData);
app.post("/:username/all_courses/course/:course_name/category/:category_name/catData", category.postData);

app.post("/:username/all_courses/course/:course_name/category/:category_name/delData", category.delData);
app.post("/:username/all_courses/course/:course_name/category/:category_name/editData", category.editData);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
