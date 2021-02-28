'use strict';

var url;

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	console.log("Page ready");

	url = document.URL;
	requestCategories(url)
})

function requestCategories (url) {
	var parsedURL = url.concat("/catData");

	$.get(parsedURL, (res, req) => {
		console.log(res)

		if (res.categories[0] != 'N/A'){
			var newCategory = '';

			for (var [key, value] of Object.entries(res.categories)) {
				newCategory +=
				'<div class="container-fluid section">' +
					'<a href="category/' + res["class"] + '/' + value["category_name"] + '" class="sections">' +
						'<h3 class="category_name">' + value["category_name"] + '</h3>' +
						'<p class="info">' + value["current_percent"] + '% of ' + value["total_percent"] + '%</p>' +
						'<p class="info">' + value["first"] + ' of ' + value["second"] + ' (' + value["tests"] + ' tests)' + '</p>' +
					'</a>' +
				'</div>';
			}
			$(".root-container").html(newCategory);
		}

		$('#addCategoryForm').submit(function(e){

			//Prevents default submit + reload (we only want submit part)
			e.preventDefault();

			var category_name = $('#category_name').val();
			var percentage = $('#percentage').val();

			console.log("Submitting  " + category_name + '  ' + percentage);

			var currentHTML = $(".root-container").html();

			currentHTML +=
			'<div class="container-fluid section">' +
				'<a href="category/' + res["class"] + '/' + category_name + '" class="sections">' +
					'<h3 class="category_name">' + category_name + '</h3>' +
					'<p class="info">0% of ' + percentage + '%</p>' +
					'<p class="info"> 0 of 0 (0 tests)</p>' +
				'</a>' +
			'</div>';

    		$(".root-container").html(currentHTML);

			$.post(parsedURL, {newAddedCategory: {
				"category_name": category_name,
				"current_percent": "0",
				"total_percent": percentage,
				"first": "0",
				"second": "0",
				"tests": "0"
			}}, postCallback);
		  });

		function postCallback(){
			alert("Category Successfully Added!");

			//Clear Form
			$('#category_name').val('');
			$('#percentage').val('');

			$("#addCategory").hide();
			$(".addButton").show();
		  }
	});
}

function addCategory() {
	$("#addCategory").show();
	$(".addButton").hide();
}

function cancelAddCategory(){
	$("#addCategory").hide();
	$(".addButton").show();
}