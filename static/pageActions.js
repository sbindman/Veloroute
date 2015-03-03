
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
	$('#tablePop').popup({});
	$('#show-standard-data').toggle();
});
//show popup
$('#table_open').on( "click", function () {
	showStandardData(routeDict);
	$('#tablePop').popup('show');
});


//show raw data
$('#show-raw-data').click( function () {
	$('#show-raw-data').toggle();
	$('#show-standard-data').toggle();
	showRawData(routeDict);
});

//show standard data
$('#show-standard-data').click( function () {
	$('#show-standard-data').toggle();
	$('#show-raw-data').toggle();
	showStandardData(routeDict);
});


// $('#table_close').on( "click", function () {
// 	$('#table_close').popup('hide');
// });


// $("#routes").on("click", showRouteDict);

//remove route
//$("#remove-route").on("click", deleteLine);

//$("tableid").css('background-color', color);