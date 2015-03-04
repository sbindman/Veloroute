
//button that starts a new route
$("#add-route").on("click", function() {
	currentLine = startNewLine(routeNum);

	$("#add-route").css('background-color', '#E8B8CB');
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
	$('#show-raw-data').hide();
	$('#show-standard-data').hide();
	$('#close').hide();

});
//show standard table when click open table
$('#table_open').on( "click", function () {
	showStandardData(routeDict);
	$('#sTable').show();
	$('#close').show();
	$('#show-raw-data').show();
});


//show raw data
$('#show-raw-data').click( function () {
	$('#show-raw-data').hide();
	$('#show-standard-data').show();
	$('#sTable').hide();
	$('#rTable').show();
	showRawData(routeDict);
});

//show standard data
$('#show-standard-data').click( function () {
	$('#show-standard-data').hide();
	$('#show-raw-data').show();
	$('#sTable').show();
	$('#rTable').hide();
	showStandardData(routeDict);
});

//close tables
$('#close').click( function () {
	$('#rTable').hide();
	$('#sTable').hide();
	$('#close').hide();
	$('#show-raw-data').hide();
	$('#show-standard-data').hide();
})




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