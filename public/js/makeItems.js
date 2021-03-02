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
                        '<p class="item_grade">Grade: ' + value['grade'] + '%</p>' +
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
            var grade = ((Number(pointsR) * 100) / Number(pointsT)).toFixed(2);
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
                '<p class="item_grade">Grade: ' + grade + '%</p>' +
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

            update_category();
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

function update_category(){
    var parsedURL = url.concat("/catData");

    $.get(parsedURL, (res, req) => {
        console.log("Updating Category");
        var total_cat_points = 0;
        var toral_cat_points_received = 0;
        var first = 0;
        var second = 0;
        var tests = 0;
        var current_percent;
        var grade;
        var percent;

        for (var [key, value] of Object.entries(res.items)) {
            total_cat_points += Number(value['points_total']);
            toral_cat_points_received += Number(value['points_received']);

            if (value['completion_type'] == 'Test'){
                tests += 1;
            }
            else{
                first +=1;
            }
        }

        second = first + tests;

        percent = ((toral_cat_points_received * 100) / total_cat_points).toFixed(2);
        
        current_percent = (percent * res['total_percent']) * .01;

        if(percent <= 59.99){
            grade = 'F';
        }
        else if(percent <= 62.99){
            grade = 'D-';
        }
        else if(percent <= 66.99){
            grade = 'D';
        }
        else if(percent <= 69.99){
            grade = 'D+';
        }
        else if(percent <= 72.99){
            grade = 'C-';
        }
        else if(percent <= 76.99){
            grade = 'C';
        }
        else if(percent <= 79.99){
            grade = 'C+';
        }
        else if(percent <= 82.99){
            grade = 'B-';
        }
        else if(percent <= 86.99){
            grade = 'B';
        }
        else if(percent <= 89.99){
            grade = 'B+';
        }
        else if(percent <= 92.99){
            grade = 'A-';
        }
        else if(percent <= 96.99){
            grade = 'A';
        }
        else{
            grade = 'A+';
        }
        
        $.post(url, {
            updatedCategory: {
                "current_percent": current_percent,
				"grade": grade,
				"percent": percent,
				"first": first,
				"second": second,
				"tests": tests,
            }
        });
        var reloadURL = url.concat("/reload");
        $.get(reloadURL);
    });
}