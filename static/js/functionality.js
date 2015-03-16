
/* Initiates a new route and adds it to a global dictionary 
*/
function startNewLine(rNum) {
	var polyline = new line(rNum);
	routeDict[polyline.id] = polyline;
	return polyline;
}

/* Ends the current line
 * All data related to a line is requested, calculated and standardized
 * Data from the requests are used to update the line objects
 */
 function endLine(route1) {

 	$("#add-route").html("<i id='spinner' class='fa fa-spinner faa-spin animated'></i>");

 	var firstRequest = getDistanceAndLefts(route1);
 	var secondRequest = calcElevation(route1);
 	var thirdRequest = getDirectRouteRatio(route1);
 	var fourthRequest = calcSpeed(route1);


	$.when( firstRequest, secondRequest, thirdRequest, fourthRequest 
	).done(function (firstResponse, secondResponse, thirdResponse, fourthResponse) {
			routeDict[route1.id].distance = firstResponse[0]; 
			routeDict[route1.id].leftTurns = firstResponse[1];
			routeDict[route1.id].elePoints = secondResponse;
			routeDict[route1.id].elevation = netElevation(secondResponse)[0];
			routeDict[route1.id].eGain = netElevation(secondResponse)[1];
			routeDict[route1.id].eLoss = netElevation(secondResponse)[2];
			routeDict[route1.id].mostDirectDistance = thirdResponse;
			routeDict[route1.id].averageSpeed = avgSpeed(fourthResponse);

			routeDict[route1.id].sDistance = standardizeDistance(firstResponse[0], thirdResponse);
			routeDict[route1.id].sLeftTurns = standardizeLefts(firstResponse[1]);
			routeDict[route1.id].sElevation = standardizeElevation(netElevation(secondResponse)[0]);
			routeDict[route1.id].sAverageSpeed = standardizeSpeed(avgSpeed(fourthResponse));

		
			
			console.log("ENDING LINE");
			routeNum ++;
			currentLine = null;
			  
			$("#add-route").removeAttr('disabled');
			$("#add-route").html('<img src="static/img/addroute.png" />');
			weightAndUpdate();
			showStandardData(routeDict);
			showRawData(routeDict);
			drawChart(routeDict);

			//highlight table after data
			$('.tablebutton').toggleClass("invert");
			setTimeout (function () {
				$('.tablebutton').toggleClass("invert");
			} , 200);
	}
	).fail(function () {
			alert("ISSUE ENDING LINE");
			routeNum ++;
			currentLine = null;
			$("#add-route").html('<img src="static/img/addroute.png" />');
			$("#add-route").removeAttr('disabled');
	});
}



/* Adds a marker to the current route 
 * If a marker is clicked (simulates a double click) the route is ended
 */
function addMarker(evt) {
	if (currentLine === null) {
		console.log("Error: Can't add a point when there is no active route");
	}
	else if (currentLine !== null) {
		var marker = L.marker(evt.latlng, { draggable:true, icon:circleIcon });
		//marker.setIcon(circleIcon);
		marker.on('dragend', function() {
			drawRoute(currentLine);
		});
		marker.addTo(map);
		currentLine.waypoints.push(marker);
		drawRoute(currentLine);

		marker.on("click", function () {
			endLine(currentLine);
		});
	}
}


/* Draws the route between a given set of waypoints
 * If there are at least 2 points then a request is sent to the directions api
 * which includes user-added waypoints
 * Those points are then added to the map
 */
function drawRoute(route2) {
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

		var directionUrl = 'http://api.tiles.mapbox.com/v4/directions/mapbox.walking/'+ waypointsString + '.json?access_token=pk.eyJ1Ijoic2JpbmRtYW4iLCJhIjoiaENWQnlrVSJ9.0DQyCLWgA0j8yBpmvt3bGA';

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
