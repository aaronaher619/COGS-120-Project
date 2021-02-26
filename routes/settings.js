exports.view = function(request, response){
    var course_name = request.params.course_name;

    response.render("settings", {
        "course": course_name
    });
}