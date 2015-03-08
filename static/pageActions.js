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
		tableopen = true;
	} else {
		$('.show-standard-data').css("color", "#434343");
		$('.show-raw-data').css("color", "#434343");
		$('#rTable').hide();
		$('#sTable').hide();
		$('#close').hide();
		$('.show-raw-data').hide();
		$('.show-standard-data').hide();
		tableopen = false;
	}
});


//show raw data
$('.show-raw-data').click( function () {
	$('.show-raw-data').css("color", "#3585a3");
	$('.show-standard-data').css("color", "#434343");
	$('#sTable').hide();
	$('#rTable').show();
});

//show standard data
$('.show-standard-data').click( function () {
	$('.show-standard-data').css("color", "#3585a3");
	$('.show-raw-data').css("color", "#434343");
	$('#sTable').show();
	$('#rTable').hide();
});




//event changes for dropdown menus
$("#sWeight").on("change", function () {
		var weight = $("#sWeight").val();
		console.log("speed weight" + weight);
		weightSpeed(routeDict, weight);
		showStandardData(routeDict);

});


$("#dWeight").on("change", function () {
	var weight = $("#dWeight").val();
	console.log("distance raw weight" + weight);
	weightDistance(routeDict, weight);
	showStandardData(routeDict);
});



$("#eWeight").on("change", function () {
		var weight = $("#eWeight").val();
		console.log("elevation weight" + weight);
		weightElevation(routeDict, weight);
		showStandardData(routeDict);
});


$("#lWeight").on("change", function () {
	var weight = $("#lWeight").val();
	console.log("lefts weight" + weight);
	weightLeft(routeDict, weight);
	showStandardData(routeDict);
});



// if ( $('#session').innerHTML != undefined ){
// 	$('#login').hide();
// 	$('#signup').hide();
// }

// $('#logout').on("click", function)


// $('#table_close').on( "click", function () {
// 	$('#table_close').popup('hide');
// });


// $("#routes").on("click", showRouteDict);

//remove route
//$("#remove-route").on("click", deleteLine);

//$("tableid").css('background-color', color);