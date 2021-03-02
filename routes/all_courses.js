var fs = require('fs')

exports.view = function(req, res){
  var username = req.params.username;

  res.render('all_courses', {
      "username": username
  });
};

exports.postData = function(req, res) {
  var newAddedClass = req.body.newAddedClass;

  var class_name = req.body.class_name;

  data[class_name] = newAddedClass;

  res.send(newAddedClass);
  console.log(data);
}

exports.getData = function(req, res) {
  var username = req.params.username;
  var jsonString = fs.readFileSync('./data.json');
  var data = JSON.parse(jsonString);
  res.json(data[username]['classes']);
}