var data = require("../categoryData.json");

exports.viewCategory = function(request, response){

    var course_name = request.params.course_name;
    var category_name = request.params.category_name;

    response.render("category", {
        "course": course_name,
        "category": category_name
    });
}

exports.postData = function(req, res) {

    var newClass = req.body.newClass;

    var con = req.params.course_name;
    var can = req.params.category_name;
    console.log(data[con][can]);
    data[con][can].push(newClass);

    res.send(newClass);
    console.log(data[con][can]);
}

exports.getData = function(req, res) {

    var co_name = req.params.course_name;
    var ca_name = req.params.category_name;

    var jso = data[co_name][ca_name];
    res.json(jso);
}