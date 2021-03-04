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

exports.delData = function(req, res) {}

exports.editData = function(req, res) {}