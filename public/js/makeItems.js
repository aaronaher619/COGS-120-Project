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
        erase();
        edit();
        console.log(res);

        var grade_bubble =
            '<h3 class="current_grade">Category Grade:</h3>' +
            '<p class="score">' + res.grade + '</p>' +
            '<p class="percent">' + res.percent + '%</p>';

        $(".grade_bubble").html(grade_bubble);

        var category_info =
            '<p class="category_percentage">Attained ' +
                '<b class="percentage_numbers">' + res.current_percent + '%</b> of ' +
                '<b class="percentage_numbers">' + res.total_percent + '%</b> Category Total' +
            '</p>' +
            '<p class="category_numbers"><b class="percentage_numbers">' + res.first + ' of ' + res.second + '</b> Category Items Finalized</p>' +
            '<p class="category_numbers"><b class="percentage_numbers">' + res.tests + '</b> Test Item(s)</p>';

        $(".category_info").html(category_info);

		if (res.items.hasOwnProperty('N/A')){
			$(".helper_div").show();
		}

        if (!res.items.hasOwnProperty('N/A')){
            $(".edit_button").show();
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

                        '<button type="button" style="display: none" id="del_' + key + '"' +
                            'class="btn btn-dark btn-lg mode deleteButton">Delete</button>' +
                        '<button type="button" style="display: none" id="edit_' + key + '"' +
                            'class="btn btn-dark btn-lg mode editButton">Edit</button>' +
                    '</div>';
            }
            $(".root-container").html(newItems);
        }

        $('#addItemForm').submit(function(e){
			//Prevents default submit + reload (we only want submit part)
			e.preventDefault();

            $(".helper_div").hide();

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
    $('#item_name').val('');
    $('#pointsR').val('');
    $('#pointsT').val('');
    $('#ForT').val('');

	$("#addItem").hide();
	$(".addButton").show();
}

function update_category(){
    var parsedURL = url.concat("/catData");

    $.get(parsedURL, (res, req) => {
        console.log("Updating Category");
        var total_cat_points = 0;
        var total_cat_points_received = 0;
        var first = 0;
        var second = 0;
        var tests = 0;
        var current_percent;
        var grade;
        var percent;

        for (var [key, value] of Object.entries(res.items)) {
            total_cat_points += Number(value['points_total']);
            total_cat_points_received += Number(value['points_received']);

            if (value['completion_type'] == 'Test'){
                tests += 1;
            }
            else{
                first +=1;
            }
        }

        second = first + tests;

        percent = ((total_cat_points_received * 100) / total_cat_points).toFixed(2);

        current_percent = ((percent * res['total_percent']) * .01).toFixed(2);

        grade = getLetterGrade(percent);

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

        var grade_bubble =
            '<h3 class="current_grade">Category Grade:</h3>' +
            '<p class="score">' + grade + '</p>' +
            '<p class="percent">' + percent + '%</p>';

        $(".grade_bubble").html(grade_bubble);

        var category_info =
        '<p class="category_percentage">Attained ' +
            '<b class="percentage_numbers">' + current_percent + '%</b> of ' +
            '<b class="percentage_numbers">' + res.total_percent + '%</b> Category Total' +
        '</p>' +
        '<p class="category_numbers">' + first + ' of ' + second + ' Category Items Finalized</p>' +
        '<p class="category_numbers">' + tests + ' Test Item(s)</p>';

        $(".category_info").html(category_info);
    });
}

function getLetterGrade(percent){
    if(percent == 0){
        return 'N/A';
    }
	else if(percent <= 59.99){
        return 'F';
    }
    else if(percent <= 62.99){
        return 'D-';
    }
    else if(percent <= 66.99){
        return 'D';
    }
    else if(percent <= 69.99){
        return 'D+';
    }
    else if(percent <= 72.99){
        return 'C-';
    }
    else if(percent <= 76.99){
        return 'C';
    }
    else if(percent <= 79.99){
        return 'C+';
    }
    else if(percent <= 82.99){
        return 'B-';
    }
    else if(percent <= 86.99){
        return 'B';
    }
    else if(percent <= 89.99){
        return 'B+';
    }
    else if(percent <= 92.99){
        return 'A-';
    }
    else if(percent <= 96.99){
        return 'A';
    }
    else{
        return 'A+';
    }
}

function edit_mode(){
    $(".editModeButton").hide();
    $(".cancel_editModeButton").show();
    $(".mode").show();

}

function cancel_edit_mode(){
    $(".editModeButton").show();
    $(".cancel_editModeButton").hide();
    $(".mode").hide();
}

function erase(){
    $(".deleteButton").click(function() {
        alert(this.id);
    });
}

function edit(){
    $(".editButton").click(function() {
        alert(this.id);
    });
}