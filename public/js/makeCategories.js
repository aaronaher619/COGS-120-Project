'use strict';

var url;

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	console.log("Page ready");

	url = document.URL;
	requestCategories(url);
})

function requestCategories (url) {
	var parsedURL = url.concat("/catData");

	$.get(parsedURL, (res, req) => {
		console.log(res);

		if (res.grade == 'N/A'){
			var grade_bubble =
				'<h3 class="current_grade">Category Grade:</h3>' +
				'<p class="score">N/A</p>' +
				'<p class="percent">0%</p>';

			$(".grade_bubble").html(grade_bubble);
		}

		if (res.categories.hasOwnProperty('N/A')){
			$(".helper_div").show();
            $(".select_helper").hide();
            $(".editModeButton").hide();
		}

		if (!res.categories.hasOwnProperty('N/A')){
			var letter_grade;
			var total_percent = 0;
			var total_possible_percent = 0;
			var newCategory = '';
			var fraction = 0;
			var fraction_percentile = 0;
			var total_percentile = 0;

			for (var [key, value] of Object.entries(res.categories)) {
				total_percent += Number(value["current_percent"]);
				total_possible_percent += Number(value["total_percent"]);

				if(!(Number(value["second"]) == 0)){
					fraction = Number(value["first"]) / Number(value["second"]);
					fraction_percentile = Number(value["total_percent"]) * fraction;
					total_percentile += fraction_percentile;
				}
				var key_id = key.replaceAll(/[^a-zA-Z0-9]/g, "");
				newCategory +=
				'<div class="container-fluid categories category_bubble" id="bubble_' + key_id + '">' +
					'<a href="' + url + '/category/' + key + '" class="" style="display:block">' +
						'<h3 class="category_name">' + key + '</h3>' +
						'<p class="info">Grade: ' + value["grade"] + ' (' + value["percent"] + '%)</p>' +
						'<p class="info">Attained <b>' + value["current_percent"] + '%</b> of <b>' + value["total_percent"] + '%</b></p>' +
					'</a>' +

					'<button type="button" style="display: none; margin: 10px 10px 0px 0px;" onclick="erase(this.id)" id="' + key + '"' +
						'class="btn btn-danger btn-lg mode deleteButton">Delete</button>' +

					'<button type="button" style="display: none; margin-top: 10px" onclick="edit(this.id)"   id="' + key + '"' +
						'class="btn btn-success btn-lg mode editButton">Edit</button>' +

					'<div id="edit_' + key_id + '" style="display: none">' +
						'<form id="editCategoryForm" class="form edit_form">' +
						'<div class="form-group ">' +
							'<label for="new_category_name">New Category Name</label>' +
							'<input type="text" class="form-control" id="new_category_name" maxlength="15" required name="new_category_name" value="' + key + '">' +
						'</div>' +

						'<div class="form-group ">' +
							'<label for="new_percentage">Enter Total Category Percentage</label>' +
							'<input type="number" class="form-control" id="new_percentage" required name="new_percentage" value="' + Number(value['total_percent']) + '">' +
						'</div>' +

						'<div class="submit">' +
							'<button type="button" id="' + key + '" onclick="cancelEditCategory(this.id)" class="btn btn-warning btn-lg cancel_button">Cancel</button>'  +
							'<input type="submit" id="submitEdit" class="btn btn-success btn-lg submitEdit_button" value="Confirm Edit"></input>' +
						'</div>' +
						'</form>' +
					'</div>' +
				'</div>';
			}

			letter_grade = getLetterGrade(total_percent)
			var grade_bubble =
				'<h3 class="current_grade">Class Grade:</h3>' +
				'<p class="score">' + letter_grade + '</p>' +
				'<p class="percent">' + total_percent.toFixed(2) + '%</p>';

			$(".grade_bubble").html(grade_bubble);
			$.post(url, {letter_grade});
			var course_info;

			if (total_possible_percent == 100){
				course_info = '<p><b class="percentage_numbers">' + total_percentile.toFixed(2) + '%</b> of Final Grade Received</p>';
			}

			else{
				course_info =
			'<p class="course_percentage">' +
				'<b class="percentage_numbers">' + total_percentile.toFixed(2) + '%</b> of Final Grade Received' +
				'</p>' +
			'<p class="course_correcter">All Total Category %\'s Summed Equals: ' +
				'<b class="percentage_numbers">' + total_possible_percent + '%</b>' +
			'</p>' +
			'<p class="course_correcter">Add More Categories Till It Equals <b  class="percentage_numbers">100%</b></p>';
			}

			$(".course_info").html(course_info);
			$(".root-container").html(newCategory);
		}

		$('#addCategoryForm').submit(function(e){
			//Prevents default submit + reload (we only want submit part)
			e.preventDefault();

			$(".helper_div").hide();

			var category_name = $('#category_name').val();
			var percentage = $('#percentage').val();

			console.log("Submitting  " + category_name + '  ' + percentage);

			var currentHTML = $(".root-container").html();
            var category_name_id = category_name.replaceAll(/[^a-zA-Z0-9]/g, "");

			currentHTML +=
			'<div class="container-fluid categories category_bubble" id="bubble_' + category_name_id + '">' +
				'<a href="' + url + '/category/' + category_name + '" class="" style="display:block">' +
					'<h3 class="category_name">' + category_name + '</h3>' +
					'<p class="info">Grade: ' + 'N/A' + ' (' + '0' + '%)</p>' +
					'<p class="info">Attained <b>0% of ' + percentage + '%</b> Category Total</p>' +
				'</a>' +

				'<button type="button" style="display: none; margin: 10px 10px 0px 0px;" onclick="erase(this.id)" id="' + category_name + '"' +
					'class="btn btn-danger btn-lg mode deleteButton">Delete</button>' +

				'<button type="button" style="display: none; margin-top: 10px" onclick="edit(this.id)"   id="' + category_name + '"' +
					'class="btn btn-success btn-lg mode editButton">Edit</button>' +

				'<div id="edit_' + category_name_id + '" style="display: none">' +
					'<form id="editCategoryForm" class="form edit_form">' +
					'<div class="form-group ">' +
						'<label for="new_category_name">New Category Name</label>' +
						'<input type="text" class="form-control" id="new_category_name" maxlength="15" required name="new_category_name" value="' + category_name + '">' +
					'</div>' +

					'<div class="form-group ">' +
						'<label for="new_percentage">Enter Total Category Percentage</label>' +
						'<input type="number" class="form-control" id="new_percentage" required name="new_percentage"' + Number(percentage) + '">' +
					'</div>' +

					'<div class="submit">' +
						'<button type="button" id="' + category_name + '" onclick="cancelEditCategory(this.id)" class="btn btn-warning btn-lg cancel_button">Cancel</button>'  +
						'<input type="submit" id="submitEdit" class="btn btn-success btn-lg" value="Confirm Edit"></input>' +
					'</div>' +
					'</form>' +
				'</div>' +
			'</div>';

    		$(".root-container").html(currentHTML);

			$.post(parsedURL, {
				newAddedCategory: {
					"current_percent": "0",
					"total_percent": percentage,
					"grade": "N/A",
					"percent": "0",
					"first": "0",
					"second": "0",
					"predictions": "0",
					"items": {"N/A": "N/A"}
				}, category_name
			}, postCallback);
		});

		function postCallback(){
			alert("Category Successfully Added!");

			//Clear Form
			$('#category_name').val('');
			$('#percentage').val('');

			$("#addCategory").hide();
			$(".addButton").show();
            $(".select_helper").show();
            $(".editModeButton").show();

			update_course();
		}
	});
}

function addCategory() {
	$("#addCategory").show();
	$(".addButton").hide();
}

function cancelAddCategory(){
    $('#category_name').val('');
    $('#percentage').val('');

	$("#addCategory").hide();
	$(".addButton").show();
}

function update_course(){
    var parsedURL = url.concat("/catData");

    $.get(parsedURL, (res, req) => {
        console.log("Updating Course");

		var letter_grade = 'N/A';
		var total_percent = 0;
		var total_possible_percent = 0;
		var fraction = 0;
		var fraction_percentile = 0;
		var total_percentile = 0;

		if (res.categories.hasOwnProperty('N/A')){
			$(".helper_div").show();
            $(".select_helper").hide();
            $(".cancel_editModeButton").hide();
            $(".addButton").show();
		}
		else{
			for (var [key, value] of Object.entries(res.categories)) {
				total_percent += Number(value["current_percent"]);
				total_possible_percent += Number(value["total_percent"]);

				if(!(Number(value["second"]) == 0)){
					fraction = Number(value["first"]) / Number(value["second"]);
					fraction_percentile = Number(value["total_percent"]) * fraction;
					total_percentile += fraction_percentile;
				}
			}
			letter_grade = getLetterGrade(total_percent)
		}

		var grade_bubble =
			'<h3 class="current_grade">Class Grade:</h3>' +
			'<p class="score">' + letter_grade + '</p>' +
			'<p class="percent">' + total_percent.toFixed(2) + '%</p>';

		$(".grade_bubble").html(grade_bubble);

		$.post(url, {letter_grade});
		var course_info;

		if (total_possible_percent == 100){
			course_info = '<p><b class="percentage_numbers">' + total_percentile.toFixed(2) + '%</b> of Final Grade Received</p>';
		}
		else{
			course_info =
		'<p class="course_percentage">' +
			'<b class="percentage_numbers">' + total_percentile.toFixed(2) + '%</b> of Final Grade Received' +
			'</p>' +
		'<p class="course_correcter">All Total Category %\'s Summed Equals: ' +
			'<b class="percentage_numbers">' + total_possible_percent + '%</b>' +
		'</p>' +
		'<p class="course_correcter">Add More Categories Till It Equals <b  class="percentage_numbers">100%</b></p>';
		}
		if (res.categories.hasOwnProperty('N/A')){
			$(".course_info").html("");
		}
		else{
			$(".course_info").html(course_info);
		}
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

function erase(category_name){
	var category_name_id = category_name.replaceAll(/[^a-zA-Z0-9]/g, "");

	var parsedURL = url.concat("/delData");
	console.log("Deleting " + category_name);

	$.post(parsedURL, {category_name});

	alert("Deleted " + category_name + "!")
	update_course();

	var bubble = document.getElementById("bubble_" + category_name_id);
	bubble.remove();

}

function cancelEditCategory(category_name){
    var key_id = category_name.replaceAll(/[^a-zA-Z0-9]/g, "");

    $("#edit_" + key_id).hide();
    $(".editButton").show();
    $(".deleteButton").show();
    $(".cancel_editModeButton").show();
}

function edit(category_name){
    var parsedURL = url.concat("/editData");

    var key_id = category_name.replaceAll(/[^a-zA-Z0-9]/g, "");

    $("#edit_" + key_id).show();
    $(".editButton").hide();
    $(".deleteButton").hide();
    $(".cancel_editModeButton").hide();

	$('#editCategoryForm').submit(function(e){
		console.log("Editing " + category_name);
		e.preventDefault();

		var new_category_name = $('#new_category_name').val();
		var new_percentage = $('#new_percentage').val();

		$.post(parsedURL, {new_percentage, new_category_name, category_name});

		var getURL = url.concat("/catData");

    	$.get(getURL, (res, req) => {
			var data = res['categories'][new_category_name];
			var new_category_name_id = new_category_name.replaceAll(/[^a-zA-Z0-9]/g, "");
			var category_name_id = category_name.replaceAll(/[^a-zA-Z0-9]/g, "");



			var updatedCategoryHTML =
			'<div class="container-fluid categories category_bubble" id="bubble_' + new_category_name_id + '">' +
				'<a href="' + url + '/category/' + new_category_name + '" class="" style="display:block">' +
					'<h3 class="category_name">' + new_category_name + '</h3>' +
					'<p class="info">Grade: ' + data["grade"] + ' (' + res["percent"] + '%)</p>' +
					'<p class="info">Attained <b>' + data["current_percent"] + '%</b> of <b>' + Number(new_percentage) + '%</b></p>' +
				'</a>' +

				'<button type="button" style="display: none; margin: 10px 10px 0px 0px;" onclick="erase(this.id)" id="' + new_category_name + '"' +
					'class="btn btn-danger btn-lg mode deleteButton">Delete</button>' +

				'<button type="button" style="display: none; margin-top: 10px" onclick="edit(this.id)"   id="' + new_category_name + '"' +
					'class="btn btn-success btn-lg mode editButton">Edit</button>' +

				'<div id="edit_' + new_category_name_id + '" style="display: none">' +
					'<form id="editCategoryForm" class="form edit_form">' +
					'<div class="form-group ">' +
						'<label for="new_category_name">New Category Name</label>' +
						'<input type="text" class="form-control" id="new_category_name" maxlength="15" required name="new_category_name" value="' + new_category_name + '">' +
					'</div>' +

					'<div class="form-group ">' +
						'<label for="new_percentage">Enter Total Category Percentage</label>' +
						'<input type="number" class="form-control" id="new_percentage" required name="new_percentage"' + Number(new_percentage) + '">' +
					'</div>' +

					'<div class="submit">' +
						'<button type="button" id="' + new_category_name + '" onclick="cancelEditCategory(this.id)" class="btn btn-warning btn-lg cancel_button">Cancel</button>'  +
						'<input type="submit" id="submitEdit" class="btn btn-success btn-lg" value="Confirm Edit"></input>' +
					'</div>' +
					'</form>' +
				'</div>' +
			'</div>';

			var bubble = document.getElementById("bubble_" + category_name_id);
			bubble.outerHTML  = updatedCategoryHTML;
		});
		cancel_edit_mode();
		update_course();
	});
}