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

		var newClass = '';

		for (var [key, value] of Object.entries(res)) {
			var class_name = value["class"];
			var professer = value["professer"];
			var grade = value["grade"];

			newClass +=
			'<a href="all_courses/course/' + class_name + '" class="class_bubble">' +
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
			'<a href="all_courses/course/' + course + '" class="class_bubble">' +
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
				"categories": {"N/A": "N/A"}
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

function cancelAddClass(){
	$("#addClass").hide();
	$(".addButton").show();
}