//button that starts a new route
$("#add-route").on("click", function() {
	currentLine = startNewLine(routeNum);

	$("#add-route").html('<img src="static/img/addrouteclicked.png" />');
	$("#add-route").attr('disabled', 'disabled');
});



//add marker
map.on('click', addMarker);


//popup
//set popup
$(document).ready(function () {
	// everything starts hidden
	$('#logout').toggle();
	$('#sTable').hide();
	$('#rTable').hide();
	$('.show-raw-data').hide();
	$('.show-standard-data').hide();
	$('#close').hide();
	$('#chart').hide();

});
//show standard table when click open table
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

$(".eChart").on("click", function () {
	$('.eChart').css("color", "#3585a3");
	$('.show-standard-data').css("color", "#434343");
	$('.show-raw-data').css("color", "#434343");
	$('#sTable').hide();
	$('#rTable').hide();
	$("#chart").show();
});

//show raw data
$('.show-raw-data').click( function () {
	$('.show-raw-data').css("color", "#3585a3");
	$('.show-standard-data').css("color", "#434343");
	$('.eChart').css("color", "#434343");
	$('#sTable').hide();
	$("#chart").hide();
	$('#rTable').show();
});

//show standard data
$('.show-standard-data').click( function () {
	$('.show-standard-data').css("color", "#3585a3");
	$('.show-raw-data').css("color", "#434343");
	$('.eChart').css("color", "#434343");
	$("#chart").hide();
	$('#rTable').hide();
	$('#sTable').show();
});


//toggle color of results tab
$('.tablebutton').on("click", function () {
	$('.tablebutton').toggleClass("invert");
})





//event changes for dropdown menus
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




// if ( $('#session').innerHTML != undefined ){
// 	$('#login').hide();
// 	$('#signup').hide();
// }

// $('#logout').on("click", function)

