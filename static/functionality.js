//create a new line object
function startNewLine(rNum) {
	var polyline = new line(rNum);
	routeDict[polyline.id] = polyline;
	return polyline;
}


 function endLine(route1) {
 	var firstRequest = getDistanceAndLefts(route1);
 	var secondRequest = calcElevation(route1);
 	var thirdRequest = getDirectRouteRatio(route1);

	$.when( firstRequest, secondRequest, thirdRequest 
	).done(function (firstResponse, secondResponse, thirdResponse) {
			console.log(firstResponse + secondResponse + thirdResponse);
			standardizeDistance(route1);
			standardizeLefts(route1);
			standardizeElevation(route1);
			
			showRouteDict();
			
			console.log("ENDING LINE");
			routeNum ++;
			currentLine = null;
	});
}


//functionality of lines

//add marker
function addMarker(evt) {
	if (currentLine == null) {
		console.log("Error: Can't add a point when there is no active route");
	}
	else if (currentLine != null) {
		var marker = L.marker(evt.latlng, { draggable:true });
		//marker.setIcon(circleIcon);
		marker.on('dragend', drawRoute);
		marker.addTo(map);
		currentLine.waypoints.push(marker);
		drawRoute();
	}
}


function drawRoute() {
	//this function should draw a route based on a number of waypoints
	var defer = $.Deferred();
	if (currentLine.waypoints.length > 1 ) {
		var waypointsString = "";
		var pointsToDraw = [];

		for (i = 0; i < currentLine.waypoints.length - 1; i++) {
			var lat = currentLine.waypoints[i].getLatLng().lat;
			var lng = currentLine.waypoints[i].getLatLng().lng;		
			waypointsString += lng + "," + lat + ";";
	  	}
	  	//accounts for omitting semi-colon
	  	var lastLat = currentLine.waypoints[currentLine.waypoints.length - 1].getLatLng().lat;
	  	var lastLng = currentLine.waypoints[currentLine.waypoints.length - 1].getLatLng().lng;

	  	waypointsString += lastLng + "," + lastLat;
	  	//console.log("point string" + waypointsString);

		var directionUrl = 'http://api.tiles.mapbox.com/v4/directions/mapbox.walking/'+ waypointsString + '.json?access_token=pk.eyJ1Ijoic2JpbmRtYW4iLCJhIjoiaENWQnlrVSJ9.0DQyCLWgA0j8yBpmvt3bGA'

		routeDict[currentLine.id].directionUrl = directionUrl;

		$.when($.get(directionUrl)).done( function (result) {
			var route = result.routes[0].geometry.coordinates;

			routeDict[currentLine.id].coordinates = route;

			pointsToDraw = route.map( function(coordinate) {
				return [coordinate[1], coordinate[0]]; //use this to switch lat and long
			});

			currentLine.polyline.setLatLngs(pointsToDraw);
			defer.resolve();
	});
 	
 	} else {
 		console.log("Error, can't draw unless more than 1 point");
 	}
 	console.log("DRAWING ROUTE");
 	return defer.promise();
 }



//remove line
//currently this deletes a line but does not move ids in hash table so that creates an issue with printing results

// function deleteLine () {
// 	currentLine = routeDict[1]; //example, should be able to delete whichever line is elected
// 	map.removeLayer(currentLine.polyline);
// 	delete routeDict[currentLine.id];
// }


//calculations

	//standarize elevation -- these value cutoffs can be changed but seem reasonable, meters?
function standardizeElevation (route) {	
	
	var rawElevation = routeDict[route.id].elevation;

	if (rawElevation < 50) { 
		routeDict[route.id].sElevation = 3;
	} else if ( rawElevation >= 50 && rawElevation < 100 ) { 
		routeDict[route.id].sElevation = 2;
	} else if (rawElevation >= 100 ) { 
		routeDict[route.id].sElevation = 1; 
	} else {
		routeDict[route.id].sElevation = null;
		alert("no standar elevation calculated, raw elevation is: " + rawElevation);
	}

	console.log("standardized elevation: " + routeDict[route.id].sElevation);
}	

function standardizeDistance (route) {
	//standardize distance -- these value cutoffs can be changed but seem reasonable

	var rawDistance = routeDict[route.id].distance;
	var rawDirectDistance = routeDict[route.id].mostDirectDistance;
	var ratio = rawDistance / rawDirectDistance;

	if (ratio < 1) { 
		routeDict[route.id].sDistance = null;
		alert("Error can't have ratio less than 1. distance and direct distance are:" + rawDistance + " , " + rawDirectDistance);
	} else if ( ratio >= 1 && ratio < 1.2) { 
		routeDict[route.id].sDistance = 3;
	} else if (ratio >= 1.2 && ratio < 1.5 ) { 
		routeDict[route.id].sDistance = 2;
	} else if (ratio >= 1.5) { 
		routeDict[route.id].sDistance = 1;  
	} else {
		routeDict[route.id].sElevation = null;
	}

	console.log("standardized distance: " + routeDict[route.id].sDistance);
	console.log("most mostDirectDistance: " + routeDict[route.id].mostDirectDistance);
	console.log("Distance: " + routeDict[route.id].distance);
}

function standardizeLefts (route){
//standardize left turns
	var rawLefts = routeDict[route.id].leftTurns;


	if (rawLefts < 5) { 
		routeDict[route.id].sLeftTurns = 3;
	} else if ( rawLefts >= 5 && rawLefts < 10 ) { 
		routeDict[route.id].sLeftTurns = 2;
	} else if (rawElevation >= 10 ) { 
		routeDict[route.id].sLeftTurns = 1; 
	} else {
		routeDict[route.id].sLeftTurns = "null";
		alert("no standard left turns, " + routeDict[route.id].sLeftTurns);
	}

	console.log("standardized left turns: " + routeDict[route.id].sLeftTurns);
}


//display information
function showRouteDict () {
	var html = "";
	var html2 = "";
	for (var i = 0; i < Object.keys(routeDict).length; i++) {
		var totalScore = routeDict[i].sDistance + routeDict[i].sLeftTurns;
		//adds a string of data that will be pushed to the popup table
		html2 += "<tr id=tableRow"+routeDict[i].id+"><td>" + i + "</td><td>" + routeDict[i].distance + "</td><td>" + routeDict[i].leftTurns + "</td><td>" + routeDict[i].sDistance +  "</td><td>" + routeDict[i].sLeftTurns + "</td><td>" + totalScore + "</td></tr>" ;
	}
	$("#table_route_info").html(html2);
}




    