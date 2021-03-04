'use strict';

var url;

$(document).ready(function() {
	console.log("Page ready");

    url = document.URL;
    requestItems(url);
});

function requestItems(url) {
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
            '<p class="category_numbers"><b class="percentage_numbers">' + res.predictions + '</b> Predicted Item(s)</p>';

        $(".category_info").html(category_info);

		if (res.items.hasOwnProperty('N/A')){
			$(".helper_div").show();
            $(".select_helper").hide();
            $(".editModeButton").hide();
		}

        if (!res.items.hasOwnProperty('N/A')){
            var newItems = '';

            for (var [key, value] of Object.entries(res.items)) {
                var bubble_color;
                var first_option = "";
                var second_option = "";

                if (value['completion_type'] == "Finalized"){
                    bubble_color = "final_color";
                    first_option = "selected";
                }
                else{
                    bubble_color = "predict_color";
                    second_option = "selected";
                }
                var key_id = key.replaceAll(/[^a-zA-Z0-9]/g, "");
                newItems +=
                '<div class="container-fluid item_bubble ' + bubble_color + '" id="bubble_' + key_id + '">' +
                    '<h3 class="item_name">' + key + '</h3>' +
                    '<p class="info">' + value['points_received'] + ' out of ' + value['points_total'] + ' Points</p>' +
                    '<p class="item_grade">Grade: ' + value['grade'] + '%</p>' +
                    '<p class="info">' + value['completion_type'] + '</p>' +

                    '<button type="button" style="display: none; margin: 10px 10px 0px 0px;" onclick="erase(this.id)" id="' + key + '"' +
                        'class="btn btn-danger btn-lg mode deleteButton">Delete</button>' +

                    '<button type="button" style="display: none; margin-top: 10px" onclick="edit(this.id)"   id="' + key + '"' +
                        'class="btn btn-success btn-lg mode editButton">Edit</button>' +

                    '<div id="edit_' + key_id + '" style="display: none">' +
                        '<form id="editItemForm" class="form edit_form">' +
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
                            '<label for="new_ForT">Is This Grade Finalized or Predicted</label>' +
                            '<select id="new_ForT" name="new_ForT" required class="form-control">' +
                                '<option value="">Please select</option>' +
                                '<option value="Finalized" ' + first_option + '>Finalized</option>' +
                                '<option value="Predicted" ' + second_option + '>Predicted</option>' +
                            '</select>' +
                        '</div>' +

                        '<div class="submit">' +
                            '<button type="button" id="' + key + '" onclick="cancelEditItem(this.id)" class="btn btn-warning btn-lg cancel_button">Cancel</button>'  +
                            '<input type="submit" id="submitEdit" class="btn btn-success btn-lg" value="Confirm Edit"></input>' +
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
            var first_option = "";
            var second_option = "";

            if (ForT == "Finalized"){
                bubble_color = "final_color";
                first_option = "selected";
            }
            else{
                bubble_color = "predict_color";
                second_option = "selected";
            }
            var item_name_id = item_name.replaceAll(/[^a-zA-Z0-9]/g, "");

			console.log("Submitting  " + item_name + '  ' + pointsR + '  ' + pointsT + '  ' + ForT);

			var currentHTML = $(".root-container").html();

			currentHTML +=
            '<div class="container-fluid item_bubble ' + bubble_color + '" id="bubble_' + item_name_id + '">' +
                '<h3 class="item_name">' + item_name + '</h3>' +
                '<p class="info">' + pointsR + ' out of ' + pointsT + ' Points</p>' +
                '<p class="item_grade">Grade: ' + grade + '%</p>' +
                '<p class="info">' + ForT + '</p>' +

                '<button type="button" style="display: none; margin: 10px 10px 0px 0px;" onclick="erase(this.id)" id="' + item_name + '"' +
                    'class="btn btn-danger btn-lg mode deleteButton">Delete</button>' +

                '<button type="button" style="display: none; margin-top: 10px" onclick="edit(this.id)"   id="' + item_name + '"' +
                    'class="btn btn-success btn-lg mode editButton">Edit</button>' +

                '<div id="edit_' + item_name_id + '" style="display: none">' +
                    '<form id="editItemForm" class="form edit_form">' +
                    '<div class="form-group ">' +
                        '<label for="new_item_name">New Category Item Name</label>' +
                        '<input type="text" class="form-control" id="new_item_name" maxlength="15" required name="new_item_name" value="' + item_name + '">' +
                    '</div>' +

                    '<div class="form-group ">' +
                        '<label for="new_pointsR">New Points Received</label>' +
                        '<input type="number" class="form-control" id="new_pointsR" required name="new_pointsR" value="' + pointsR + '">' +
                    '</div>' +

                    '<div class="form-group ">' +
                        '<label for="new_pointsT">New Total Points</label>' +
                        '<input type="number" class="form-control" id="new_pointsT" required name="new_pointsT" value="' + pointsR + '">' +
                    '</div>' +

                    '<div class="form-group ">' +
                        '<label for="new_ForT">Is This Grade Finalized or Predicted</label>' +
                        '<select id="new_ForT" name="new_ForT" required class="form-control">' +
                            '<option value="">Please select</option>' +
                            '<option value="Finalized" ' + first_option + '>Finalized</option>' +
                            '<option value="Predicted" ' + second_option + '>Predicted</option>' +
                        '</select>' +
                    '</div>' +

                    '<div class="submit">' +
                        '<button type="button" id="' + item_name + '" onclick="cancelEditItem(this.id)" class="btn btn-warning btn-lg cancel_button">Cancel</button>'  +
                        '<input type="submit" id="submitEdit" class="btn btn-success btn-lg" value="Confirm Edit"></input>' +
                    '</div>' +
                    '</form>' +
                '</div>' +
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
            $(".select_helper").show();
            $(".editModeButton").show();

            update_category();
		}
    });
}

function addItem() {
	$("#addItem").show();
	$(".addButton").hide();
    $(".editModeButton").hide();
}

function cancelAddItem(){
    $('#item_name').val('');
    $('#pointsR').val('');
    $('#pointsT').val('');
    $('#ForT').val('');

	$("#addItem").hide();
	$(".addButton").show();
    $(".editModeButton").show();
}

function update_category(){
    var parsedURL = url.concat("/catData");

    $.get(parsedURL, (res, req) => {
        console.log("Updating Category");

        var total_cat_points = 0;
        var total_cat_points_received = 0;
        var first = 0;
        var second = 0;
        var predictions = 0;
        var current_percent = 0;
        var grade = "N/A";
        var percent = 0;

        if (res.items.hasOwnProperty('N/A')){
			$(".helper_div").show();
            $(".select_helper").hide();
            $(".cancel_editModeButton").hide();
            $(".addButton").show();
		}

        else{
            for (var [key, value] of Object.entries(res.items)) {
                total_cat_points += Number(value['points_total']);
                total_cat_points_received += Number(value['points_received']);

                if (value['completion_type'] == 'Predicted'){
                    predictions += 1;
                }
                else{
                    first +=1;
                }
            }
            second = first + predictions;
            percent = ((total_cat_points_received * 100) / total_cat_points).toFixed(2);
            current_percent = ((percent * res['total_percent']) * .01).toFixed(2);
            grade = getLetterGrade(percent);
        }

        $.post(url, {
            updatedCategory: {
                "current_percent": current_percent,
				"grade": grade,
				"percent": percent,
				"first": first,
				"second": second,
				"predictions": predictions,
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
        '<p class="category_numbers">' + predictions + ' Predicted Item(s)</p>';

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
    $(".addButton").hide();
}

function cancel_edit_mode(){
    $(".editModeButton").show();
    $(".cancel_editModeButton").hide();
    $(".mode").hide();
    $(".addButton").show();
}

function erase(item_name){
    var parsedURL = url.concat("/delData");
    console.log("Deleting " + item_name);

    $.post(parsedURL, {item_name});

    alert("Deleted " + item_name + "!")
    update_category();

    var item_name_id = item_name.replaceAll(/[^a-zA-Z0-9]/g, "");

    var bubble = document.getElementById("bubble_" + item_name_id);
    bubble.remove();
}

function cancelEditItem(item_name){
    var key_id = item_name.replaceAll(/[^a-zA-Z0-9]/g, "");

    $("#edit_" + key_id).hide();
    $(".editButton").show();
    $(".deleteButton").show();
    $(".cancel_editModeButton").show();
}

function edit(item_name){
    var parsedURL = url.concat("/editData");

    var key_id = item_name.replaceAll(/[^a-zA-Z0-9]/g, "");

    $("#edit_" + key_id).show();
    $(".editButton").hide();
    $(".deleteButton").hide();
    $(".cancel_editModeButton").hide();

    $('#editItemForm').submit(function(e){
        console.log("Editing " + item_name);
        e.preventDefault();

        var new_item_name = $('#new_item_name').val();
        var new_pointsR = $('#new_pointsR').val();
        var new_pointsT = $('#new_pointsT').val();
        var new_grade = ((Number(new_pointsR) * 100) / Number(new_pointsT)).toFixed(2);
        var new_ForT = $('#new_ForT').val();

        $.post(parsedURL, {
            updatedItem: {
				"points_received": new_pointsR,
				"points_total": new_pointsT,
				"grade": new_grade,
				"completion_type": new_ForT
            }, new_item_name, item_name
        });

        var bubble_color;
        var first_option = "";
        var second_option = "";

        if (new_ForT == "Finalized"){
            bubble_color = "final_color";
            first_option = "selected";
        }
        else{
            bubble_color = "predict_color";
            second_option = "selected";
        }
        var new_item_name_id = new_item_name.replaceAll(/[^a-zA-Z0-9]/g, "");
        var item_name_id = item_name.replaceAll(/[^a-zA-Z0-9]/g, "");

        var updatedItemHTML =
        '<div class="container-fluid item_bubble ' + bubble_color + '" id="bubble_' + new_item_name_id + '">' +
            '<h3 class="item_name">' + new_item_name + '</h3>' +
            '<p class="info">' + new_pointsR + ' out of ' + new_pointsT + ' Points</p>' +
            '<p class="item_grade">Grade: ' + new_grade + '%</p>' +
            '<p class="info">' + new_ForT + '</p>' +

            '<button type="button" style="display: none; margin: 10px 10px 0px 0px;" onclick="erase(this.id)" id="' + new_item_name + '"' +
                'class="btn btn-danger btn-lg mode deleteButton">Delete</button>' +

            '<button type="button" style="display: none; margin-top: 10px" onclick="edit(this.id)"   id="' + new_item_name + '"' +
                'class="btn btn-success btn-lg mode editButton">Edit</button>' +

            '<div id="edit_' + new_item_name_id + '" style="display: none">' +
                '<form id="editItemForm" class="form edit_form">' +
                '<div class="form-group ">' +
                    '<label for="new_item_name">New Category Item Name</label>' +
                    '<input type="text" class="form-control" id="new_item_name" maxlength="15" required name="new_item_name" value="' + new_item_name + '">' +
                '</div>' +

                '<div class="form-group ">' +
                    '<label for="new_pointsR">New Points Received</label>' +
                    '<input type="number" class="form-control" id="new_pointsR" required name="new_pointsR" value="' + new_pointsR + '">' +
                '</div>' +

                '<div class="form-group ">' +
                    '<label for="new_pointsT">New Total Points</label>' +
                    '<input type="number" class="form-control" id="new_pointsT" required name="new_pointsT" value="' + new_pointsT + '">' +
                '</div>' +

                '<div class="form-group ">' +
                    '<label for="new_ForT">Is This Grade Finalized or Predicted</label>' +
                    '<select id="new_ForT" name="new_ForT" required class="form-control">' +
                        '<option value="">Please select</option>' +
                        '<option value="Finalized" ' + first_option + '>Finalized</option>' +
                        '<option value="Predicted" ' + second_option + '>Predicted</option>' +
                    '</select>' +
                '</div>' +

                '<div class="submit">' +
                    '<button type="button" id="' + new_item_name + '" onclick="cancelEditItem(this.id)" class="btn btn-warning btn-lg cancel_button">Cancel</button>'  +
                    '<input type="submit" id="submitEdit" class="btn btn-success btn-lg" value="Confirm Edit"></input>' +
                '</div>' +
                '</form>' +
            '</div>' +
        '</div>';

        var bubble = document.getElementById("bubble_" + item_name_id);
        bubble.outerHTML  = updatedItemHTML;
        cancel_edit_mode();
        update_category();
    });
}