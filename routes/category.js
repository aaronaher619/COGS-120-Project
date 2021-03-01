var data = require("../data.json");

exports.viewCategory = function(request, response){

    var course_name = request.params.course_name;
    var category_name = request.params.category_name;

    response.render("category", {
        "course": course_name,
        "category": category_name
    });
}

exports.postData = function(req, res) {
    var course_name = req.params.course_name;
    var category_name = req.params.category_name;

    var newClass = req.body.newClass;

    data[course_name][category_name].push(newClass);

    res.send(newClass);
    console.log(data[course_name][category_name]);
}

exports.getData = function(req, res) {

    var course_name = req.params.course_name;
    var category_name = req.params.category_name;

    var jso = data[course_name]['categories'][category_name];
    res.json(jso);
}