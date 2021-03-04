var fs = require('fs')

exports.viewCategory = function(req, res){
    var course_name = req.params.course_name;
    var category_name = req.params.category_name;

    res.render("category", {
        "course": course_name,
        "category": category_name
    });
}

exports.postUpdated= function(req, res) {
    var username = req.params.username;
    var course_name = req.params.course_name;
    var category_name = req.params.category_name;

    var updatedCategory = req.body.updatedCategory;

    var jsonString = fs.readFileSync('./data.json');
    var data = JSON.parse(jsonString);

    data[username]['classes'][course_name]['categories'][category_name]['current_percent'] = updatedCategory['current_percent'];
    data[username]['classes'][course_name]['categories'][category_name]['grade'] = updatedCategory['grade'];
    data[username]['classes'][course_name]['categories'][category_name]['percent'] = updatedCategory['percent'];
    data[username]['classes'][course_name]['categories'][category_name]['first'] = updatedCategory['first'];
    data[username]['classes'][course_name]['categories'][category_name]['second'] = updatedCategory['second'];
    data[username]['classes'][course_name]['categories'][category_name]['tests'] = updatedCategory['tests'];

    var jsonUpdated = JSON.stringify(data, null, 2)
    fs.writeFileSync('./data.json', jsonUpdated)

    res.send(updatedCategory);
}

exports.postData = function(req, res) {
    var username = req.params.username;
    var course_name = req.params.course_name;
    var category_name = req.params.category_name;

    var newAddedItem = req.body.newAddedItem;
    var item_name = req.body.item_name;

    var jsonString = fs.readFileSync('./data.json');
    var data = JSON.parse(jsonString);

    if (data[username]['classes'][course_name]['categories'][category_name]['items'].hasOwnProperty('N/A')){
        delete data[username]['classes'][course_name]['categories'][category_name]['items']['N/A'];
    }

    data[username]['classes'][course_name]['categories'][category_name]['items'][item_name] = newAddedItem;

    var jsonUpdated = JSON.stringify(data, null, 2)
    fs.writeFileSync('./data.json', jsonUpdated)

    res.send(newAddedItem);
}

exports.getData = function(req, res) {
    var username = req.params.username;
    var course_name = req.params.course_name;
    var category_name = req.params.category_name;

    var jsonString = fs.readFileSync('./data.json');
    var data = JSON.parse(jsonString);
  
    res.json(data[username]['classes'][course_name]['categories'][category_name]);
}

exports.delData = function(req, res) {
    var username = req.params.username;
    var course_name = req.params.course_name;
    var category_name = req.params.category_name;

    var item_name = req.body.item_name;
    
    var jsonString = fs.readFileSync('./data.json');
    var data = JSON.parse(jsonString);

    delete data[username]['classes'][course_name]['categories'][category_name]['items'][item_name];

    var jsonUpdated = JSON.stringify(data, null, 2)
    fs.writeFileSync('./data.json', jsonUpdated)

    res.send(item_name);
}

exports.editData = function(req, res) {
    
}