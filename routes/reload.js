var data = require("../data.json");

exports.reloadCat = function(req, res) {
    var course_name = req.params.course_name;
    var category_name = req.params.category_name;

    res.render("category", {
        "course": course_name,
        "category": category_name,
        "grade": data[course_name]['categories'][category_name]['grade'],
        "percent": data[course_name]['categories'][category_name]['percent'],
        "current_percent": data[course_name]['categories'][category_name]['current_percent'],
        "total_percent": data[course_name]['categories'][category_name]['total_percent'],
        "first": data[course_name]['categories'][category_name]['first'],
        "second": data[course_name]['categories'][category_name]['second'],
        "tests": data[course_name]['categories'][category_name]['tests']
    });
}