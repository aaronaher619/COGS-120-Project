'use strict';

var url;

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	console.log("Page ready");

	url = document.URL;
	requestClasses(url)
})

function requestClasses (url) {
	var parsedURL = url.concat("/catData");

	$.get(parsedURL, (res, req) => {
		console.log(res);

		if (res.classes.hasOwnProperty('N/A')){
			$(".helper_div").show();
            $(".select_helper").hide();
            $(".editModeButton").hide();
		}

		if (!res.classes.hasOwnProperty('N/A')){
			$(".editModeButton").show();
			var newClass = '';

			for (var [key, value] of Object.entries(res.classes)) {
				var key_id = key.replaceAll(/[^a-zA-Z0-9]/g, "");
				newClass +=
				'<div class="container-fluid classes class_bubble" id="bubble_' + key_id + '">' +
					'<a href="all_courses/course/' + key + '" class="" style="display:block">' +
						'<div class="row align-items-center">' +
							'<div class="col-8 class_column">' +
								'<h3 class="class_name">' + key + '</h3>' +
								'<p class="prof">' + value["professer"] + '</p>' +
							'</div>' +

							'<div class="col-auto grade_column">' +
								'<h3 class="grade">' + value["grade"] + '</h3>' +
							'</div>' +
						'</div>' +
					'</a>'+

					'<button type="button" style="display: none; margin: 10px 10px 0px 0px;" onclick="erase(this.id)" id="' + key + '"' +
						'class="btn btn-danger btn-lg mode deleteButton">Delete</button>' +

					'<button type="button" style="display: none; margin-top: 10px" onclick="edit(this.id)"   id="' + key + '"' +
						'class="btn btn-success btn-lg mode editButton">Edit</button>' +

					'<div id="edit_' + key_id + '" style="display: none">' +
						'<form id="editClassForm" class="form edit_form">' +
							'<div class="form-group">' +
								'<label for="new_class_name">New Class Name</label>' +
								'<input type="text" class="form-control" id="new_class_name" maxlength="15" required name="new_class_name" value="' + key + '">' +
							'</div>' +

							'<div class="form-group">' +
								'<label for="new_professer">New Professer Name</label>' +
								'<input type="text" class="form-control" id="new_professer" required name="new_professer" value="' + value["professer"] + '">' +
							'</div>' +

							'<div class="submit">' +
								'<button type="button" id="' + key + '" onclick="cancelEditClass(this.id)" class="btn btn-warning btn-lg cancel_button">Cancel</button>'  +
								'<input type="submit" id="submitEdit" class="btn btn-success btn-lg" value="Confirm"></input>' +
							'</div>' +
						'</form>' +
					'</div>' +
				'</div>';
			}
			$(".root-container").html(newClass);
		}

		$('#addClassForm').submit(function(e){
			//Prevents default submit + reload (we only want submit part)
			e.preventDefault();

			$(".helper_div").hide();
			$(".select_helper").show();
			$(".editModeButton").show();

			var class_name = $('#class_name').val();
			var professer = $('#professer').val();

			console.log("Submitting  " + class_name + '  ' + professer);

			var class_name_id = class_name.replaceAll(/[^a-zA-Z0-9]/g, "");
			var currentHTML = $(".root-container").html();

			currentHTML +=
			'<div class="container-fluid classes class_bubble" id="bubble_' + class_name_id + '">' +
				'<a href="all_courses/course/' + class_name + '" class="" style="display:block">' +
					'<div class="row align-items-center">' +
						'<div class="col-8 class_column">' +
							'<h3 class="class_name">' + class_name + '</h3>' +
							'<p class="prof">' + professer + '</p>' +
						'</div>' +

						'<div class="col-auto grade_column">' +
							'<h3 class="grade">N/A</h3>' +
						'</div>' +
					'</div>' +
				'</a>'+

				'<button type="button" style="display: none; margin: 10px 10px 0px 0px;" onclick="erase(this.id)" id="' + class_name + '"' +
					'class="btn btn-danger btn-lg mode deleteButton">Delete</button>' +

				'<button type="button" style="display: none; margin-top: 10px" onclick="edit(this.id)"   id="' + class_name + '"' +
					'class="btn btn-success btn-lg mode editButton">Edit</button>' +

				'<div id="edit_' + class_name_id + '" style="display: none">' +
					'<form id="editClassForm" class="form edit_form">' +
						'<div class="form-group">' +
							'<label for="new_class_name">New Class Name</label>' +
							'<input type="text" class="form-control" id="new_class_name" maxlength="15" required name="new_class_name" value="' + class_name + '">' +
						'</div>' +

						'<div class="form-group">' +
							'<label for="new_professer">New Professer Name</label>' +
							'<input type="text" class="form-control" id="new_professer" required name="new_professer" value="' + professer + '">' +
						'</div>' +

						'<div class="submit">' +
							'<button type="button" id="' + class_name + '" onclick="cancelEditClass(this.id)" class="btn btn-warning btn-lg cancel_button">Cancel</button>'  +
							'<input type="submit" id="submitEdit" class="btn btn-success btn-lg" value="Confirm"></input>' +
						'</div>' +
					'</form>' +
				'</div>' +
			'</div>';

    		$(".root-container").html(currentHTML);

			$.post(parsedURL, {
				newAddedClass: {
					"professer": professer,
					"grade": "N/A",
					"percent": "0",
					"categories": {"N/A": "N/A"}
				}, class_name
			}, postCallback);
		});

		function postCallback(){
			alert("Class Successfully Added!");

			//Clear Form
			$('#class_name').val('');
			$('#professer').val('');

			$("#addClass").hide();
			$(".addButton").show();
		}
	});
}

function addClass() {
	$("#addClass").show();
	$(".addButton").hide();
	$(".editModeButton").hide();
}

function cancelAddClass(){
    $('#class_name').val('');
    $('#professer').val('');

	$("#addClass").hide();
	$(".addButton").show();
	$(".editModeButton").show();
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

function erase(class_name){
	var class_name_id = class_name.replaceAll(/[^a-zA-Z0-9]/g, "");

	var parsedURL = url.concat("/delData");
	console.log("Deleting " + class_name);

	$.post(parsedURL, {class_name});

	alert("Deleted " + class_name + "!")

	var bubble = document.getElementById("bubble_" + class_name_id);
	bubble.remove();
	$(".helper_div").show();
	$(".select_helper").hide();
	$(".cancel_editModeButton").hide();
    $(".addButton").show();

}

function cancelEditClass(class_name){
    var class_name_id = class_name.replaceAll(/[^a-zA-Z0-9]/g, "");

    $("#edit_" + class_name_id).hide();
    $(".editButton").show();
    $(".deleteButton").show();
    $(".cancel_editModeButton").show();
}

function edit(class_name){
    var parsedURL = url.concat("/editData");

    var class_name_id = class_name.replaceAll(/[^a-zA-Z0-9]/g, "");

    $("#edit_" + class_name_id).show();
    $(".editButton").hide();
    $(".deleteButton").hide();
    $(".cancel_editModeButton").hide();

	$('#editClassForm').submit(function(e){
		console.log("Editing " + class_name);
		e.preventDefault();

		var new_class_name = $('#new_class_name').val();
		var new_professer = $('#new_professer').val();
		var new_class_name_id = new_class_name.replaceAll(/[^a-zA-Z0-9]/g, "");

		var updatedCategoryHTML =
		'<div class="container-fluid classes class_bubble" id="bubble_' + new_class_name_id + '">' +
			'<a href="all_courses/course/' + new_class_name + '" class="" style="display:block">' +
				'<div class="row align-items-center">' +
					'<div class="col-8 class_column">' +
						'<h3 class="class_name">' + new_class_name + '</h3>' +
						'<p class="prof">' + new_professer + '</p>' +
					'</div>' +

					'<div class="col-auto grade_column">' +
						'<h3 class="grade">N/A</h3>' +
					'</div>' +
				'</div>' +
			'</a>'+

			'<button type="button" style="display: none; margin: 10px 10px 0px 0px;" onclick="erase(this.id)" id="' + new_class_name + '"' +
				'class="btn btn-danger btn-lg mode deleteButton">Delete</button>' +

			'<button type="button" style="display: none; margin-top: 10px" onclick="edit(this.id)"   id="' + new_class_name + '"' +
				'class="btn btn-success btn-lg mode editButton">Edit</button>' +

			'<div id="edit_' + new_class_name_id + '" style="display: none">' +
				'<form id="editClassForm" class="form edit_form">' +
					'<div class="form-group">' +
						'<label for="new_class_name">New Class Name</label>' +
						'<input type="text" class="form-control" id="new_class_name" maxlength="15" required name="new_class_name" value="' + new_class_name + '">' +
					'</div>' +

					'<div class="form-group">' +
						'<label for="new_professer">New Professer Name</label>' +
						'<input type="text" class="form-control" id="new_professer" required name="new_professer" value="' + new_professer + '">' +
					'</div>' +

					'<div class="submit">' +
						'<button type="button" id="' + new_class_name + '" onclick="cancelEditClass(this.id)" class="btn btn-warning btn-lg cancel_button">Cancel</button>'  +
						'<input type="submit" id="submitEdit" class="btn btn-success btn-lg" value="Confirm"></input>' +
					'</div>' +
				'</form>' +
			'</div>' +
		'</div>';

		var bubble = document.getElementById("bubble_" + class_name_id);
		bubble.outerHTML  = updatedCategoryHTML;
		$.post(parsedURL, {new_professer, new_class_name, class_name});
		cancel_edit_mode();
	});
}