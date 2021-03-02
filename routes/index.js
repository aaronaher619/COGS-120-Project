var fs = require('fs')

exports.view = function(request, response){
  response.render('index');
};

exports.postData = function(req, res) {
  var newUser = req.body.newUser;
  var new_username = req.body.new_username;

  var jsonString = fs.readFileSync('./data.json');
  var data = JSON.parse(jsonString);

  data[new_username] = newUser;

  console.log(data);

  var jsonUpdated = JSON.stringify(data, null, 2)

  fs.writeFileSync('./data.json', jsonUpdated)
  data[new_username] = newUser;

  res.send(newUser);
}

exports.getData = function(req, res) {
  var jsonString = fs.readFileSync('./data.json');
  var data = JSON.parse(jsonString);
  res.json(data);
}