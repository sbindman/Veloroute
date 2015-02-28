
//button that starts a new route
$("#add-route").on("click", startNewLine);

$("#routes").on("click", showRouteDict);

map.on("dblclick", endLine);


//remove route
//$("#remove-route").on("click", deleteLine);

//show elevation on click
map.on('click', function(evt) {
	showElevation(evt.latlng);
});

map.on('click', addMarker);



$(document).ready(function () {
	$('#tablePop').popup({});
});

$('#table_open').on( "click", function () {
	$('#tablePop').popup('show');
});

// $('#table_close').on( "click", function () {
// 	$('#table_close').popup('hide');
// });



//$("tableid").css('background-color', color);