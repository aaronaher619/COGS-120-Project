'use strict';

var url;

$(document).ready(function() {
	console.log("Page ready");

    url = document.URL;
    requestItems(url);
});

function requestItems (url) {
    var parsedURL = url.concat("/catData");

    $.get(parsedURL, (res, req) => {
        console.log(res);

        if (!res.items.hasOwnProperty('N/A')){
            var newItems = '';

            for (var [key, value] of Object.entries(res.items)) {
                var bubble_color;

                if (value['completion_type'] == "Finalized"){
                    var bubble_color = "final_color";
                }

                else{
                    var bubble_color = "test_color";
                }

                newItems +=
                    '<div class="container-fluid item_bubble ' + bubble_color + '">' +
                        '<h3 class="item_name">' + key + '</h3>' +
                        '<p class="info">' + value['points_received'] + ' out of ' + value['points_total'] + ' Points</p>' +
                        '<p class="info">Grade: ' + value['grade'] + '%</p>' +
                        '<p class="info">' + value['completion_type'] + '</p>' +
                    '</div>';
            }
            $(".root-container").html(newItems);
        }

        $('#addItemForm').submit(function(e){

			//Prevents default submit + reload (we only want submit part)
			e.preventDefault();

			var item_name = $('#item_name').val();
			var pointsR = $('#pointsR').val();
            var pointsT = $('#pointsT').val();
            var grade = ((parseInt(pointsR, 10) * 100) / parseInt(pointsT, 10)).toFixed(2);
			var ForT = $('#ForT').val();

            var bubble_color;

            if (ForT == "Finalized"){
                var bubble_color = "final_color";
            }

            else{
                var bubble_color = "test_color";
            }

			console.log("Submitting  " + item_name + '  ' + pointsR + '  ' + pointsT + '  ' + ForT);

			var currentHTML = $(".root-container").html();

			currentHTML +=
            '<div class="container-fluid item_bubble ' + bubble_color + '">' +
                '<h3 class="item_name">' + item_name + '</h3>' +
                '<p class="info">' + pointsR + ' out of ' + pointsT + ' Points</p>' +
                '<p class="info">Grade: ' + grade + '%</p>' +
                '<p class="info">' + ForT + '</p>' +
            '</div>';

    		$(".root-container").html(currentHTML);

			$.post(parsedURL, {
                newAddedItem: {
                    "points_received": pointsR,
                    "points_total": pointsT,
                    "grade": grade,
                    "completion_type": ForT
			    }, item_name
            }, postCallback);
		  });

		function postCallback(){
			alert("Category Item Successfully Added!");

			//Clear Form
			$('#item_name').val('');
			$('#pointsR').val('');
            $('#pointsT').val('');
			$('#ForT').val('');

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
