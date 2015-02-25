
//button that starts a new route
$("#add-route").on("click", startNewLine);
//$("#calcElevation").on("click", calcElevation);
//$("#routes").on("click", showRouteDict);

//remove route
//$("#remove-route").on("click", deleteLine);

//show elevation on click
map.on('click', function(evt) {
	showElevation(evt.latlng);
});

map.on('click', addMarker);
map.on('dblclick', endLine);
$("#routes").on("click", endLine);

