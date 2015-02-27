
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

