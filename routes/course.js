var data = require("../data.json");

exports.viewCourse = function(request, response){
    var course_name = request.params.course_name;
    response.render("course", data[course_name]);
}

exports.postData = function(req, res) {
    var course_name = req.params.course_name;
    var newAddedCategory = req.body.newAddedCategory;

    if (data[course_name]['categories'][0] == 'N/A'){
      data[course_name]['categories'].splice(0,1);
    }

    console.log(data[course_name].categories);
    data[course_name].categories.push(newAddedCategory);

    res.send(newAddedCategory);
    console.log(data[course_name]['categories']);
  }

  exports.getData = function(req, res) {
    var course_name = req.params.course_name;
    res.json(data[course_name]);
}