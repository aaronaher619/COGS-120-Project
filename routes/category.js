var data = require("../data.json");

exports.viewCategory = function(request, response){

    var course_name = request.params.course_name;
    var category_name = request.params.category_name;

    response.render("category", {
        "course": course_name,
        "category": category_name,
        "grade": data[course_name]['categories'][category_name]['grade'],
        "percent": data[course_name]['categories'][category_name]['percent']
    });
}

exports.postData = function(req, res) {
    var course_name = req.params.course_name;
    var category_name = req.params.category_name;

    var newAddedItem = req.body.newAddedItem;
    var item_name = req.body.item_name;

    if (data[course_name]['categories'][category_name]['items'].hasOwnProperty('N/A')){
        delete data[course_name]['categories'][category_name]['items']['N/A'];
    }

    data[course_name]['categories'][category_name]['items'][item_name] = newAddedItem;

    res.send(newAddedItem);
    console.log(data[course_name]['categories'][category_name]['items']);
}

exports.getData = function(req, res) {

    var course_name = req.params.course_name;
    var category_name = req.params.category_name;

    res.json(data[course_name]['categories'][category_name]);
}