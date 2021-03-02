'use strict';

var url;

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	console.log("Page ready");

	url = document.URL;
	requestLogin(url)
    signUp(url)
})

function requestLogin (url) {
	var parsedURL = url.concat("catData");

	$.get(parsedURL, (res, req) => {
		console.log(res);

        $('#loginForm').submit(function(e){
			//Prevents default submit + reload (we only want submit part)
			e.preventDefault();

			var username = $('#username').val();
			var password = $('#password').val();

            if (res.hasOwnProperty(username)){
                if (res[username]['password'] == password){
                    location.replace(url + username + '/all_courses');
                }
            }
            else{
                $("#wrong_login").show();
            }
        });
    });
}

function show_login() {
	$("#login_input").show();
	$(".addButton").hide();
    $("#loginLabel").show();
}

function cancelLogin(){
	$("#login_input").hide();
	$(".addButton").show();
    $("#wrong_login").hide();
    $("#loginLabel").hide();
}

function show_signUp(){
    $("#signUp_input").show();
	$(".addButton").hide();
    $("#signUpLabel").show();
}

function cancelSignUp(){
	$("#signUp_input").hide();
	$(".addButton").show();
    $("#signUpLabel").hide();
}

function signUp(){
    var parsedURL = url.concat("catData");

    $('#signUpForm').submit(function(e){
			//Prevents default submit + reload (we only want submit part)
			e.preventDefault();

			var new_username = $('#new_username').val();
			var new_password = $('#new_password').val();

            $.post(parsedURL, {
                newUser: {
                    "password": new_password,
                    "classes": {"N/A": "N/A"}
                }, new_username
            });

            alert("Successfully Signed Up!");
            location.replace(url + new_username + '/all_courses');
        });
}