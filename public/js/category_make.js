'use strict';

var url;

$(document).ready(function() {

    url = document.URL;
    var categorySet = requestCategories(url)
});

function requestCategories (url) {
    var parsedURL = url.replace("category/", "category/catData/");

    var got = $.get(parsedURL, (res, req) => {
        var classJSON = res;
        console.log(res);

        var newProjects = '';

        for(var i = 0; i < res.length; i++){

            var currentCompletion = res[i]["completion"];

            var test;
            var bubbleClass;

            if(currentCompletion == "1"){
                test = " F I N A L";
                bubbleClass = "final-grade";
			} else if (currentCompletion == "2"){
                test = "(test grade)";
                bubbleClass = "test-grade";
			} else {
                test = "<br />";
                bubbleClass = "nothing-grade";
			}

            newProjects += '<div class="section ' + bubbleClass + '"> <div> Assignment ' + (i + 1) + '</div> <div class="final-text">';
            newProjects += test + '</div></div> <br />';
		}

        var addProject = '<div class="section new-grade"> <div class="fw"> + ADD NEW ASSIGNMENT </div> </div>';

        $(".root-container").html(newProjects);
        $(".add-container").html(addProject)

        $(".new-grade").click(addNewClass);
    });
}

function addNewClass(e) {


    var parsedPostURL = url.replace("category/", "category/catData/");

    var currentHTML = $(".root-container").html();
    currentHTML += '<div class="section nothing-grade"> <div> new assignment </div> <br /> </div> <br />';

    $(".root-container").html(currentHTML);

    $.post(parsedPostURL, {newClass: {
        "completion": "0",
        "date": "Jan 1",
        "Grade": "100"
	}}, () => console.log('postFinish'));
}
