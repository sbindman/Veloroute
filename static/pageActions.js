
//button that starts a new route
$("#add-route").on("click", function() {
	startNewLine();
	$("#add-route").css('background-color', '#E8B8CB');
	//$("#add-route").attr('disabled', 'disabled');
});

$("#routes").on("click", showRouteDict);

map.on("dblclick", function () {
	endLine();
	$("#add-route").css('background-color', '#E89599');
	$("#add-route").removeAttr('disabled');
});


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

// $(document).ready(function () {
// 	$('#tablePop2').popup({});
// 	$('#tablePop2').popup('show');
// });


$('#tableRow0').on("click", function() {
	$("#tableRow0").css('background-color', '#E8B8CB');
});

$('#tableRow1').on("click", function() {
	$("#tableRow1").css('background-color', '#E8B9DB');
});
// $('#table_close').on( "click", function () {
// 	$('#table_close').popup('hide');
// });



//$("tableid").css('background-color', color);