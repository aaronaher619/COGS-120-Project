var fs = require('fs')

exports.viewCourse = function(req, res){
  var course_name = req.params.course_name;
  var username = req.params.username;

  res.render("course", {
    "username": username,
    "course": course_name,
  });
}

exports.postLetterGrade = function(req, res) {
  var username = req.params.username;
  var course_name = req.params.course_name;

  var letter_grade = req.body.letter_grade;

  var jsonString = fs.readFileSync('./data.json');
  var data = JSON.parse(jsonString);

  data[username]['classes'][course_name]['grade'] = letter_grade;

  var jsonUpdated = JSON.stringify(data, null, 2)
  fs.writeFileSync('./data.json', jsonUpdated)

  res.send(letter_grade);
}

exports.postData = function(req, res) {  
  var username = req.params.username;
  var course_name = req.params.course_name;

  var newAddedCategory = req.body.newAddedCategory;
  var category_name = req.body.category_name;

  var jsonString = fs.readFileSync('./data.json');
  var data = JSON.parse(jsonString);

  if (data[username]['classes'][course_name]['categories'].hasOwnProperty('N/A')){
    delete data[username]['classes'][course_name]['categories']['N/A'];
  }

  data[username]['classes'][course_name]['categories'][category_name] = newAddedCategory;

  var jsonUpdated = JSON.stringify(data, null, 2)
  fs.writeFileSync('./data.json', jsonUpdated)

  res.send(newAddedCategory);
  }

exports.getData = function(req, res) {
  var username = req.params.username;
  var course_name = req.params.course_name;

  var jsonString = fs.readFileSync('./data.json');
  var data = JSON.parse(jsonString);

  res.json(data[username]['classes'][course_name]);
}

exports.delData = function(req, res) {
  var username = req.params.username;
  var course_name = req.params.course_name;

  var category_name = req.body.category_name;

  var jsonString = fs.readFileSync('./data.json');
  var data = JSON.parse(jsonString);

  delete data[username]['classes'][course_name]['categories'][category_name];

  if(Object.keys(data[username]['classes'][course_name]['categories']).length == 0){
      data[username]['classes'][course_name]['categories']["N/A"] = "N/A";
  }

  var jsonUpdated = JSON.stringify(data, null, 2)
  fs.writeFileSync('./data.json', jsonUpdated)

  res.send(category_name);
}

exports.editData = function(req, res) {
  var username = req.params.username;
  var course_name = req.params.course_name;

  var new_current_percent = req.body.new_current_percent;
  var new_total_percent = req.body.new_total_percent;
  var new_category_name = req.body.new_category_name;
  var category_name = req.body.category_name;

  var jsonString = fs.readFileSync('./data.json');
  var full_data = JSON.parse(jsonString);

  var full_str = JSON.stringify(full_data);
  var str = JSON.stringify(full_data[username]['classes'][course_name]['categories']);

  str = str.replace(category_name, new_category_name);
  var data = JSON.parse(str);

  data[new_category_name]["current_percent"] = new_current_percent;
  data[new_category_name]["total_percent"] = new_total_percent;
  console.log(data);
  console.log(full_data[username]['classes'][course_name]['categories']);

  replace_str = JSON.stringify(data);
  find_str = JSON.stringify(full_data[username]['classes'][course_name]['categories']);

  str = full_str.replace(find_str, replace_str);
  data = JSON.parse(str);

  var jsonUpdated = JSON.stringify(data, null, 2)
  fs.writeFileSync('./data.json', jsonUpdated)

  res.send(new_total_percent);
}