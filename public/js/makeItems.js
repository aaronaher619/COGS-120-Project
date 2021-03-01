'use strict';

var url;

$(document).ready(function() {

    url = document.URL;
    requestItems(url)
});

function requestItems (url) {
    var parsedURL = url.concat("/catData");
    console.log(parsedURL)

    $.get(parsedURL, (res, req) => {
        console.log(res);

        var newItems = '';

        //for(var i = 0; i < res.length; i++){
        for (var [key, value] of Object.entries(res.items)) {
            console.log(res.items);
            console.log(key);

            var currentCompletion = value["completion"];

            var test;
            var bubbleClass;

            if(currentCompletion == "1"){
                test = " F I N A L";
                bubbleClass = "final-grade";
			} else if (currentCompletion == "2"){
                test = "(test grade)";
                bubbleClass = "test-grade";
			} else {
                test = "<br/>";
                bubbleClass = "nothing-grade";
			}

            newItems +=
                '<div class="section ' + bubbleClass + '">' +
                    '<div>' + key + '</div>' +
                    '<div class="final-text">' + test + '</div>' +
                '</div>' +
                '<br/>';
		}

        $(".root-container").html(newItems);

        $('#addItemForm').submit(function(e){

			//Prevents default submit + reload (we only want submit part)
			e.preventDefault();

			var item_name = $('#item_name').val();
			var grade = $('#grade').val();

			console.log("Submitting  " + item_name + '  ' + grade);

			var currentHTML = $(".root-container").html();

			currentHTML +=
                '<div class="section ' + bubbleClass + '">' +
                        '<div>' + key + '</div>' +
                        '<div class="final-text">' + test + '</div>' +
                '</div>' +
                '<br/>';

    		$(".root-container").html(currentHTML);

			$.post(parsedURL, {newAddedCategory: {
				"category_name": category_name,
				"current_percent": "0",
				"total_percent": percentage,
				"first": "0",
				"second": "0",
				"tests": "0"
			}}, postCallback);
		  });

		function postCallback(){
			alert("Category Item Successfully Added!");

			//Clear Form
			$('#item_name').val('');
			$('#grade').val('');

			$("#addItem").hide();
			$(".addButton").show();
		  }
    });
}

function addItem() {
	$("#addItem").show();
	$(".addButton").hide();
}

function cancelAddItem(){
	$("#addItem").hide();
	$(".addButton").show();
}
