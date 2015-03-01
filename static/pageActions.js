
//button that starts a new route
$("#add-route").on("click", function() {
	currentLine = startNewLine(routeNum);

	$("#add-route").css('background-color', '#E8B8CB');
	$("#add-route").attr('disabled', 'disabled');
});


//end route
map.on("dblclick", function () {
	endLine(currentLine);
	$("#add-route").css('background-color', '#E89599');
	$("#add-route").removeAttr('disabled');
});



//add marker
map.on('click', addMarker);


//popup
//set popup
$(document).ready(function () {
	$('#tablePop').popup({});
});
//show popup
$('#table_open').on( "click", function () {
	$('#tablePop').popup('show');
});



// $('#table_close').on( "click", function () {
// 	$('#table_close').popup('hide');
// });


// $("#routes").on("click", showRouteDict);

//remove route
//$("#remove-route").on("click", deleteLine);

//$("tableid").css('background-color', color);