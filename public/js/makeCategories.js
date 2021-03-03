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

				newCategory +=
				'<a href="' + url + '/category/' + key + '" class="category_bubble">' +
					'<div class="container-fluid categories">' +
						'<h3 class="category_name">' + key + '</h3>' +
						'<p class="info">Grade: ' + value["grade"] + ' (' + value["percent"] + '%)</p>' +
						'<p class="info">Attained <b>' + value["current_percent"] + '%</b> of <b>' + value["total_percent"] + '%</b></p>' +
					'</div>' +
				'</a>';
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
			console.log(url);
			currentHTML +=
			'<a href="' + url + '/category/' + category_name + '" class="category_bubble">' +
				'<div class="container-fluid categories">' +
					'<h3 class="category_name">' + category_name + '</h3>' +
					'<p class="info">Grade: ' + 'N/A' + ' (' + '0' + '%)</p>' +
					'<p class="info">Attained <b>0% of ' + percentage + '%</b> Category Total</p>' +
				'</div>' +
			'</a>';

    		$(".root-container").html(currentHTML);

			$.post(parsedURL, {
				newAddedCategory: {
					"current_percent": "0",
					"total_percent": percentage,
					"grade": "N/A",
					"percent": "0",
					"first": "0",
					"second": "0",
					"tests": "0",
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

		var letter_grade;
		var total_percent = 0;
		var total_possible_percent = 0;
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