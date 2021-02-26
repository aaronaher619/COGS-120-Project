'use strict';

var url;

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	console.log("Page ready");

	url = document.URL;
	requestClasses(url)
})

function requestClasses (url) {
	var parsedURL = url.replace("all_courses", "all_courses/catData");

	$.get(parsedURL, (res, req) => {
		console.log(res);

		var newClass = '';

		for (var [key, value] of Object.entries(res)) {
			var class_name = value["class"];
			var professer = value["professer"];
			var grade = value["grade"];

			newClass +=
			'<a href="course/' + class_name + '" class="class_bubble">' +
				'<div class="container-fluid classes">' +
					'<div class="row align-items-center">' +
						'<div class="col-lg-6 col-md-6 class_column">' +
							'<h3 class="class_name">' + class_name + '</h3>' +
							'<p class="prof">' + professer + '</p>' +
						'</div>' +

						'<div class="col-lg-6 col-md-6 class_column">' +
							'<h3 class="grade">' + grade + '</h3>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</a>';
		}

		var addClassButton =
		'<div>' +
			'<button type="button" style="display: show" onclick="addClass()" class="btn btn-dark btn-lg addButton">Add a Class</button>' +
		'</div>' +

		'<div id="addClass" style="display: none">' +
			'<form id="addClassForm" class="form" method="post">' +
				'<div class="form-group ">' +
					'<label for="class_name">Enter Class Name</label>' +
					'<input type="text" class="form-control" id="class_name" name="class_name">' +
				'</div>' +

				'<div class="form-group ">' +
					'<label for="professer">Enter Professor Name</label>' +
					'<input type="text" class="form-control" id="professer" name="professer">' +
				'</div>' +

				'<div class="submit">' +
					'<input type="submit" id="submitClass" class="btn btn-dark btn-lg" value="Add The Class"></input>' +
				'</div>' +
			'</form>' +
		'</div>';

		$(".add-container").html(addClassButton)
		$(".root-container").html(newClass);

		$('#addClassForm').submit(function(e){

			//Prevents default submit + reload (we only want submit part)
			e.preventDefault();

			var course = $('#class_name').val();
			var professer = $('#professer').val();
			var grade = "N/A";

			console.log("Submitting  " + course + '  ' + professer);

			var currentHTML = $(".root-container").html();

			currentHTML +=
			'<a href="course/' + course + '" class="class_bubble">' +
				'<div class="container-fluid classes">' +
					'<div class="row align-items-center">' +
						'<div class="col-lg-6 col-md-6 class_column">' +
							'<h3 class="class_name">' + course + '</h3>' +
							'<p class="prof">' + professer + '</p>' +
						'</div>' +

						'<div class="col-lg-6 col-md-6 class_column">' +
							'<h3 class="grade">' + grade + '</h3>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</a>';

    		$(".root-container").html(currentHTML);

			$.post(parsedURL, {newAddedClass: {
				"class": course,
				"professer": professer,
				"grade": grade,
				"percentile": "N/A",
				"focus": "N/A",
				"categories": "N/A"
			}}, postCallback);
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
}