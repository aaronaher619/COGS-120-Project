var data = require("../data.json");

exports.viewCourse = function(request, response){
    var course_name = request.params.course_name;
    response.render("course", data[course_name]);
}