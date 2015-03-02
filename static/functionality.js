//create a new line object
function startNewLine(rNum) {
	var polyline = new line(rNum);
	routeDict[polyline.id] = polyline;
	return polyline;
}


 function endLine(route1) {
 	var firstRequest = getDistanceAndLefts(route1);
 	var secondRequest = calcElevation(route1);
 	var thirdRequest = getDirectRouteRatio(route1); //this will return the direct route distance
 	//dummy variable sine elevation doesn't seem to be working
 	//var secondRequest = 5;

	$.when( firstRequest, secondRequest, thirdRequest 
	).done(function (firstResponse, secondResponse, thirdResponse) {
			console.log("RESPONSES:" + firstResponse[0] + " , " + firstResponse[1] + " , " + secondResponse + " , " + thirdResponse);
			//firstresponse[0] = distance, firstResponse[1] = lefts, thirdresponse = direct distance
			routeDict[route1.id].distance = firstResponse[0]; 
			routeDict[route1.id].leftTurns = firstResponse[1];
			routeDict[route1.id].mostDirectDistance = thirdResponse;

			//tests when elevation seems to be working
			//console.log("THIRD RESPONSE" + secondResponse);
			//console.log("THIRD RESPONSE[0]" + secondResponse[0]);

			routeDict[route1.id].sDistance = standardizeDistance(firstResponse[0], thirdResponse);
			routeDict[route1.id].sLeftTurns = standardizeLefts(firstResponse[1]);
			routeDict[route1.id].sElevation = standardizeElevation(thirdResponse);
		
			showRouteDict(routeDict);
			
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
		marker.on('dragend', function() {
			drawRoute(currentLine);
		});
		marker.addTo(map);
		currentLine.waypoints.push(marker);
		drawRoute(currentLine);
	}
}


function drawRoute(route2) {
	//this function should draw a route based on a number of waypoints
	var defer = $.Deferred();
	if (route2.waypoints.length > 1 ) {
		var waypointsString = "";
		var pointsToDraw = [];

		for (i = 0; i < route2.waypoints.length - 1; i++) {
			var lat = route2.waypoints[i].getLatLng().lat;
			var lng = route2.waypoints[i].getLatLng().lng;		
			waypointsString += lng + "," + lat + ";";
	  	}
	  	//accounts for omitting semi-colon
	  	var lastLat = route2.waypoints[route2.waypoints.length - 1].getLatLng().lat;
	  	var lastLng = route2.waypoints[route2.waypoints.length - 1].getLatLng().lng;

	  	waypointsString += lastLng + "," + lastLat;
	  	//console.log("point string" + waypointsString);

		var directionUrl = 'http://api.tiles.mapbox.com/v4/directions/mapbox.walking/'+ waypointsString + '.json?access_token=pk.eyJ1Ijoic2JpbmRtYW4iLCJhIjoiaENWQnlrVSJ9.0DQyCLWgA0j8yBpmvt3bGA'

		routeDict[route2.id].directionUrl = directionUrl;

		$.when($.get(directionUrl)
		).done( function (result) {
			var route = result.routes[0].geometry.coordinates;

			routeDict[route2.id].coordinates = route;
			pointsToDraw = route.map( function(coordinate) {
				return [coordinate[1], coordinate[0]]; //use this to switch lat and long
			});

			route2.polyline.setLatLngs(pointsToDraw);
			defer.resolve();
		}
		).fail( function (result) {
			alert("there was an issue drawing the route");
		});
 	
 	} else {
 		console.log("Error, can't draw unless more than 1 point");
 	}
 	console.log("DRAWING ROUTE");
 	return defer.promise();
 }



//calculations

	//standarize elevation -- these value cutoffs can be changed but seem reasonable, meters?
function standardizeElevation (elev) {	

	var sElev = null;

	if (elev < 150) { 
		sElev = 3;
	} else if ( elev >= 150 && elev < 250 ) { 
		sElev = 2;
	} else if (elev >= 250 ) { 
		sElev = 1; 
	} else {
		alert("no standar elevation calculated, raw elevation is: " + elev);
	}

	console.log("standardized elevation: " + sElev);
	return sElev;
}	

function standardizeDistance (dist, directDist) {
	//standardize distance -- these value cutoffs can be changed but seem reasonable

	var ratio = dist / directDist;
	var responseValue = null;

	if (ratio < 1) { 
		alert("Error can't have ratio less than 1. distance and direct distance are:" + dist + " , " + directDist);
	} else if ( ratio >= 1 && ratio < 1.2) { 
		responseValue = 3;
	} else if (ratio >= 1.2 && ratio < 1.5 ) { 
		responseValue = 2;
	} else if (ratio >= 1.5) { 
		responseValue = 1;  
	} else {
		responseValue = null;
	}

	console.log("standardized distance: " + responseValue);
	console.log("most mostDirectDistance: " + directDist);
	console.log("Distance: " + dist);

	return responseValue;
}

function standardizeLefts (rawLefts){
//standardize left turns
	var sLefts = null;

	if (rawLefts < 5) { 
		sLefts = 3;
	} else if ( rawLefts >= 5 && rawLefts < 10 ) { 
		sLefts = 2;
	} else if (rawLefts >= 10 ) { 
		sLefts = 1; 
	} else {
		alert("no standard left turns, " + rawLefts);
	}

	console.log("standardized left turns: " + sLefts);
	return sLefts;
}


//display information
function showRouteDict (routeDictionary) {
	var html = "";
	var html2 = "";
	for (var i = 0; i < Object.keys(routeDictionary).length; i++) {
		var totalScore = routeDictionary[i].sDistance + routeDictionary[i].sLeftTurns;
		//adds a string of data that will be pushed to the popup table
		html2 += "<tr id=tableRow"+routeDictionary[i].id+"><td>" + i + "</td><td>" + routeDictionary[i].distance + "</td><td>" + routeDictionary[i].leftTurns + "</td><td>" + routeDictionary[i].sDistance +  "</td><td>" + routeDictionary[i].sLeftTurns + "</td><td>" + totalScore + "</td></tr>" ;
	}
	$("#table_route_info").html(html2);
}


//remove line
//currently this deletes a line but does not move ids in hash table so that creates an issue with printing results

// function deleteLine () {
// 	currentLine = routeDict[1]; //example, should be able to delete whichever line is elected
// 	map.removeLayer(currentLine.polyline);
// 	delete routeDict[currentLine.id];
// }

    