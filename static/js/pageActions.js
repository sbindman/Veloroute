//button that triggers the start of a new route
$("#add-route").on("click", function() {
	currentLine = startNewLine(routeNum);
	$("#add-route").html('<img src="static/img/addrouteclicked.png" />');
	$("#add-route").attr('disabled', 'disabled');
});



//button the triggers adding a marker
map.on('click', addMarker);


//hide all tables on page load
$(document).ready(function () {
	$('#logout').toggle();
	$('#sTable').hide();
	$('#rTable').hide();
	$('.show-raw-data').hide();
	$('.show-standard-data').hide();
	$('#close').hide();
	$('#chart').hide();
	$('#about_table').hide();
	$('#help_table').hide();

});


//toggle opening of help/about tables
$('#about_button').on("click", function() {
	if (aboutOpen) {
		$('#about_table').hide();
		aboutOpen = false;
	} else {
		$('#help_table').hide();
		$('#about_table').show();
		aboutOpen = true;
		helpOpen = false;
	}
});

$('#help_button').on("click", function() {
	if (helpOpen) {
		$('#help_table').hide();
		helpOpen = false;
	} else {
		$('#about_table').hide();
		$('#help_table').show();
		aboutOpen = false;
		helpOpen = true;
	}
});


/* show raw data when click "show results" table 
 * or if table is already open, close all tables
 */
$('#table_open').on( "click", function () {
	if (tableopen === false) {
		$('#sTable').hide();
		$('#rTable').show();
		$('#close').show();
		$('.show-standard-data').show();
		$('.show-raw-data').show();
		$('.show-raw-data').css("color", "#3585a3");
		$('#results').html('<i class="fa fa-angle-double-down"></i>');
		tableopen = true;
	} else {
		$('.show-standard-data').css("color", "#434343");
		$('.show-raw-data').css("color", "#434343");
		$('.eChart').css("color", "#434343");
		$('#rTable').hide();
		$('#sTable').hide();
		$('#close').hide();
		$('.show-raw-data').hide();
		$('.show-standard-data').hide();
		$('#chart').hide();
		$('#results').html('<i class="fa fa-angle-double-up"></i>');
		tableopen = false;
	}
});

//show elevation chart
$(".eChart").on("click", function () {
	$('.eChart').css("color", "#3585a3");
	$('.show-standard-data').css("color", "#434343");
	$('.show-raw-data').css("color", "#434343");
	$('#sTable').hide();
	$('#rTable').hide();
	$("#chart").show();
});

//show raw data table
$('.show-raw-data').click( function () {
	$('.show-raw-data').css("color", "#3585a3");
	$('.show-standard-data').css("color", "#434343");
	$('.eChart').css("color", "#434343");
	$('#sTable').hide();
	$("#chart").hide();
	$('#rTable').show();
});

//show standardized data table
$('.show-standard-data').click( function () {
	$('.show-standard-data').css("color", "#3585a3");
	$('.show-raw-data').css("color", "#434343");
	$('.eChart').css("color", "#434343");
	$("#chart").hide();
	$('#rTable').hide();
	$('#sTable').show();
});


//toggle color of results tab when table is opened/closed
$('.tablebutton').on("click", function () {
	$('.tablebutton').toggleClass("invert");
});



/* buttons that allow a user to update variable  
 * weights.  when a weighting is updated, all 
 * variable scores should be updated
 */
$("#sWeight").on("change", function () {
	sWeight = parseInt($("#sWeight").val());
	weightAndUpdate();
});


$("#dWeight").on("change", function () {
	dWeight = parseInt($("#dWeight").val());
	weightAndUpdate();
});


$("#eWeight").on("change", function () {
		eWeight = parseInt($("#eWeight").val());
		weightAndUpdate();
});


$("#lWeight").on("change", function () {
	lWeight = parseInt($("#lWeight").val());
	weightAndUpdate();
});


