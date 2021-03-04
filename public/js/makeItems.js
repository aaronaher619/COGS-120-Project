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
                    '<div class="container-fluid item_bubble ' + bubble_color + '" id="bubble_' + key + '">' +
                        '<h3 class="item_name">' + key + '</h3>' +
                        '<p class="info">' + value['points_received'] + ' out of ' + value['points_total'] + ' Points</p>' +
                        '<p class="item_grade">Grade: ' + value['grade'] + '%</p>' +
                        '<p class="info">' + value['completion_type'] + '</p>' +

                        '<button type="button" style="display: none; margin: 10px 10px 0px 0px;" onclick="erase(this.id)" id="' + key + '"' +
                            'class="btn btn-dark btn-lg mode deleteButton">Delete</button>' +

                        '<button type="button" style="display: none; margin-top: 10px" onclick="edit(this.id)"   id="' + key + '"' +
                            'class="btn btn-dark btn-lg mode editButton">Edit</button>' +

                        '<div id="editItem" style="display: none">' +
                            '<form id="editItemForm" class="form">' +
                            '<div class="form-group ">' +
                                '<label for="new_item_name">New Category Item Name</label>' +
                                '<input type="text" class="form-control" id="new_item_name" maxlength="15" required name="new_item_name" value="' + key + '">' +
                            '</div>' +
            
                            '<div class="form-group ">' +
                                '<label for="new_pointsR">New Points Received</label>' +
                                '<input type="number" class="form-control" id="new_pointsR" required name="new_pointsR" value="' + value['points_received'] + '">' +
                            '</div>' +
            
                            '<div class="form-group ">' +
                                '<label for="new_pointsT">New Total Points</label>' +
                                '<input type="number" class="form-control" id="new_pointsT" required name="new_pointsT" value="' + value['points_total'] + '">' +
                            '</div>' +
            
                            '<div class="form-group ">' +
                                '<label for="new_ForT">Is This Grade Finalized or Test</label>' +
                                '<select id="new_ForT" name="new_ForT" required class="form-control">' +
                                    '<option value="">Please select</option>' +
                                    '<option value="Finalized">Finalized</option>' +
                                    '<option value="Test">Test</option>' +
                                '</select>' +
                            '</div>' +
            
                            '<div class="submit">' +
                                '<button type="button" onclick="cancelEditItem()" class="btn btn-dark btn-lg cancel_button">Cancel</button>'  +
                                '<input type="submit" id="submitEdit" class="btn btn-dark btn-lg" value="Edit"></input>' +
                            '</div>' +
                            '</form>' +
                        '</div>' +
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
            '<div class="container-fluid item_bubble ' + bubble_color + '" id="bubble_' + key + '">' +
                '<h3 class="item_name">' + item_name + '</h3>' +
                '<p class="info">' + pointsR + ' out of ' + pointsT + ' Points</p>' +
                '<p class="item_grade">Grade: ' + grade + '%</p>' +
                '<p class="info">' + ForT + '</p>' +

                '<button type="button" style="display: none; margin: 10px 10px 0px 0px;" onclick="erase(this.id)" id="' + key + '"' +
                    'class="btn btn-dark btn-lg mode deleteButton">Delete</button>' +

                '<button type="button" style="display: none; margin-top: 10px" onclick="edit(this.id)"   id="' + key + '"' +
                    'class="btn btn-dark btn-lg mode editButton">Edit</button>' +
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

function erase(item_name){
    var parsedURL = url.concat("/delData");
    console.log("Deleteing " + item_name);

    $.post(parsedURL, {item_name});

    alert("Deleted " + item_name + "!")
    update_category()

    var myobj = document.getElementById("bubble_" + item_name);
    myobj.remove();
}

function cancelEditItem(){
    $("#editItem").hide();
    $(".editButton").show();
    $(".deleteButton").show();
    $(".cancel_editModeButton").show();
}

function edit(key){
    $("#editItem").show();
    $(".editButton").hide();
    $(".deleteButton").hide();
    $(".cancel_editModeButton").hide();
    
    console.log(key);
}