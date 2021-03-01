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

		if (!res.categories.hasOwnProperty('N/A')){
			var newCategory = '';

			for (var [key, value] of Object.entries(res.categories)) {
				newCategory +=
				'<a href="' + url + '/category/' + key + '" class="category_bubble">' +
					'<div class="container-fluid categories">' +
						'<h3 class="category_name">' + key + '</h3>' +
						'<p class="info">Grade: ' + value["grade"] + ' with ' + value["percent"] + '%</p>' +
						'<p class="info">Attained ' + value["current_percent"] + '% of ' + value["total_percent"] + '% Category Total</p>' +
						'<p class="info">' + value["first"] + ' of ' + value["second"] + ' (' + value["tests"] + ' tests)' + '</p>' +
					'</div>' +
				'</a>';
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
			console.log(url);
			currentHTML +=
			'<a href="' + url + '/category/' + category_name + '" class="category_bubble">' +
				'<div class="container-fluid categories">' +
					'<h3 class="category_name">' + category_name + '</h3>' +
					'<p class="info">Grade: ' + 'N/A' + ' with ' + '0' + '%</p>' +
					'<p class="info">Attained 0% of ' + percentage + '% Category Total</p>' +
					'<p class="info"> 0 of 0 (0 tests)</p>' +
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