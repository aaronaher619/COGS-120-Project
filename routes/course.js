var data = require("../data.json");

exports.viewCourse = function(request, response){
    var course_name = request.params.course_name;

    response.render("course", {
      "course": course_name,
      "grade": data[course_name].grade,
      "percent": data[course_name].percent,
      "percentile": data[course_name].percentile,
      "focus": data[course_name].focus
    });
}

exports.postData = function(req, res) {
    var course_name = req.params.course_name;

    var newAddedCategory = req.body.newAddedCategory;
    var category_name = req.body.category_name;

    if (data[course_name]['categories'].hasOwnProperty('N/A')){
      delete data[course_name]['categories']['N/A'];
    }

    data[course_name]['categories'][category_name] = newAddedCategory;

    res.send(newAddedCategory);
    console.log(data[course_name]['categories']);
  }

  exports.getData = function(req, res) {
    var course_name = req.params.course_name;
    res.json(data[course_name]);
}