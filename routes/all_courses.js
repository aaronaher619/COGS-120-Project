var fs = require('fs')

exports.view = function(req, res){
  var username = req.params.username;

  res.render('all_courses', {
      "username": username
  });
};

exports.postData = function(req, res) {
  var username = req.params.username;
  var newAddedClass = req.body.newAddedClass;

  var class_name = req.body.class_name;

  var jsonString = fs.readFileSync('./data.json');
  var data = JSON.parse(jsonString);

  if (data[username]['classes'].hasOwnProperty('N/A')){
    delete data[username]['classes']['N/A'];
  }

  data[username]['classes'][class_name] = newAddedClass;

  var jsonUpdated = JSON.stringify(data, null, 2)
  fs.writeFileSync('./data.json', jsonUpdated)

  res.send(newAddedClass);
}

exports.getData = function(req, res) {
  var username = req.params.username;

  var jsonString = fs.readFileSync('./data.json');
  var data = JSON.parse(jsonString);

  res.json(data[username]);
}

exports.delData = function(req, res) {
  var username = req.params.username;

  var class_name = req.body.class_name;

  var jsonString = fs.readFileSync('./data.json');
  var data = JSON.parse(jsonString);

  delete data[username]['classes'][class_name];

  if(Object.keys(data[username]['classes']).length == 0){
      data[username]['classes']["N/A"] = "N/A";
  }

  var jsonUpdated = JSON.stringify(data, null, 2)
  fs.writeFileSync('./data.json', jsonUpdated)

  res.send(class_name);
}

exports.editData = function(req, res) {
  var username = req.params.username;

  var new_class_name = req.body.new_class_name;
  var class_name = req.body.class_name;
  var new_professer = req.body.new_professer;


  var jsonString = fs.readFileSync('./data.json');
  var data = JSON.parse(jsonString);

  str = JSON.stringify(data);
  str = str.replace(class_name, new_class_name);

  var data = JSON.parse(str);

  data[username]['classes'][new_class_name]["professer"] = new_professer;

  var jsonUpdated = JSON.stringify(data, null, 2)
  fs.writeFileSync('./data.json', jsonUpdated)

  res.send(new_class_name);
}