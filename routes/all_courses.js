/*
 * GET home page.
 */
var data = require("../data.json");

  exports.view = function(request, response){

    var username = request.body.username;
    var password = request.body.password;

    response.render('all_courses', {
      "username": username
  });
};

exports.postData = function(req, res) {

  var newAddedClass = req.body.newAddedClass;
  data[newAddedClass.class] = newAddedClass;

  res.send(newAddedClass);
  console.log(data);
}

exports.getData = function(req, res) {
  res.json(data);
}