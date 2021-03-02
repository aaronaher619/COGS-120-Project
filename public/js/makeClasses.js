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
		}

		if (!res.classes.hasOwnProperty('N/A')){
			var newClass = '';

			for (var [key, value] of Object.entries(res.classes)) {

				newClass +=
				'<a href="all_courses/course/' + key + '" class="class_bubble">' +
					'<div class="container-fluid classes">' +
						'<div class="row align-items-center">' +
							'<div class="col-lg-6 col-md-6 class_column">' +
								'<h3 class="class_name">' + key + '</h3>' +
								'<p class="prof">' + value["professer"] + '</p>' +
							'</div>' +

							'<div class="col-lg-6 col-md-6 class_column">' +
								'<h3 class="grade">' + value["grade"] + '</h3>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</a>';
			}
			$(".root-container").html(newClass);
		}

		$('#addClassForm').submit(function(e){
			//Prevents default submit + reload (we only want submit part)
			e.preventDefault();

			$(".helper_div").hide();

			var class_name = $('#class_name').val();
			var professer = $('#professer').val();

			console.log("Submitting  " + class_name + '  ' + professer);

			var currentHTML = $(".root-container").html();

			currentHTML +=
			'<a href="all_courses/course/' + class_name + '" class="class_bubble">' +
				'<div class="container-fluid classes">' +
					'<div class="row align-items-center">' +
						'<div class="col-lg-6 col-md-6 class_column">' +
							'<h3 class="class_name">' + class_name + '</h3>' +
							'<p class="prof">' + professer + '</p>' +
						'</div>' +

						'<div class="col-lg-6 col-md-6 class_column">' +
							'<h3 class="grade">N/A</h3>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</a>';

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
}

function cancelAddClass(){
	$("#addClass").hide();
	$(".addButton").show();
}