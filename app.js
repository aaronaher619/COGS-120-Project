
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

app.get("/all_courses", all_courses.view);
app.post("/all_courses", all_courses.view)
app.get("/all_courses/catData", all_courses.getData);
app.post("/all_courses/catData", all_courses.postData);

app.get("/all_courses/course/:course_name", course.viewCourse);
app.get("/all_courses/course/:course_name/catData", course.getData);
app.post("/all_courses/course/:course_name/catData", course.postData);

app.get("/all_courses/course/:course_name/category/:category_name", category.viewCategory);
app.post("/all_courses/course/:course_name/category/:category_name", category.postUpdated);
app.get("/all_courses/course/:course_name/category/:category_name/catData", category.getData);
app.post("/all_courses/course/:course_name/category/:category_name/catData", category.postData);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
