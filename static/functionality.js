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
 	var fourthRequest = calcSpeed(route1);


	$.when( firstRequest, secondRequest, thirdRequest, fourthRequest 
	).done(function (firstResponse, secondResponse, thirdResponse, fourthResponse) {
			console.log("RESPONSES:" + firstResponse[0] + " , " + firstResponse[1] + " , " + secondResponse + " , " + thirdResponse + " , " + fourthResponse);
			//firstresponse[0] = distance, firstResponse[1] = lefts, secondresponse = elevation, thirdresponse = direct distance
			routeDict[route1.id].distance = firstResponse[0]; 
			routeDict[route1.id].leftTurns = firstResponse[1];
			routeDict[route1.id].elevation = netElevation(secondResponse);
			routeDict[route1.id].mostDirectDistance = thirdResponse;
			routeDict[route1.id].averageSpeed = avgSpeed(fourthResponse);

			routeDict[route1.id].sDistance = standardizeDistance(firstResponse[0], thirdResponse);
			routeDict[route1.id].sLeftTurns = standardizeLefts(firstResponse[1]);
			routeDict[route1.id].sElevation = standardizeElevation(netElevation(secondResponse));
			routeDict[route1.id].sAverageSpeed = standardizeSpeed(avgSpeed(fourthResponse));
		
			
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
			$("#add-route").css('background-color', '#E89599');
			$("#add-route").removeAttr('disabled');
		})
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
function netElevation(elevationPoints) {
	//calculates net elevation from a list of points
	var currentEle = elevationPoints[0];
	var totalEle = 0;	
	for (var i = 1; i < elevationPoints.length; i++) {
		console.log("EVP: " +elevationPoints[i]);
	 	totalEle += Math.abs(elevationPoints[i] - currentEle);
	 	currentEle = elevationPoints[i];
	 }
	console.log("total elevation" + totalEle);
	totalEle = totalEle.toPrecision(3);
	return totalEle;		
}



function avgSpeed(speedPoints) {
	//calculates net elevation from a list of points
	var totalSpeed = 0;	

	for (var i = 0; i < speedPoints.length; i++) {
	 	if (speedPoints[i] <= 25){
	 		totalSpeed += 25;
	 	} else if (speedPoints[i] > 25 && speedPoints[i] < 99){
	 		totalSpeed += speedPoints[i];
	 	} else if (speedPoints[i] === 99){
	 		totalSpeed += 45;
	 	} else {
	 		alert("issue with average speed" + speedPoints[i]);
	 	}
	 }
	var avg = totalSpeed/speedPoints.length;
	console.log("average speed: " + avg);
	avg = avg.toPrecision(2);

	return (avg);		
}



	//standarize elevation -- these value cutoffs can be changed but seem reasonable, meters?
function standardizeElevation (elev) {	

	var sElev = null;

	if (elev < 30) { 
		sElev = 5;
	} else if ( elev >= 30 && elev < 60 ) { 
		sElev = 4;
	} else if ( elev >= 60 && elev < 90 ) { 
		sElev = 3;
	} else if ( elev >= 90 && elev < 120 ) { 
		sElev = 2;
	} else if (elev >= 120 ) { 
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
	} else if ( ratio >= 1 && ratio < 1.1) { 
		responseValue = 5;
	} else if (ratio >= 1.1 && ratio < 1.2 ) { 
		responseValue = 4;
	} else if (ratio >= 1.2 && ratio < 1.3 ) { 
		responseValue = 3;
	} else if (ratio >= 1.3 && ratio < 1.4 ) { 
		responseValue = 2;
	} else if (ratio >= 1.4) { 
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

	if (rawLefts === 0) { 
		sLefts = 5;
	} else if ( rawLefts > 0 && rawLefts < 3 ) { 
		sLefts = 4;
	} else if ( rawLefts >= 3 && rawLefts < 6 ) { 
		sLefts = 3;
	} else if ( rawLefts >= 6 && rawLefts < 10 ) { 
		sLefts = 2;
	} else if (rawLefts >= 10 ) { 
		sLefts = 1;  
	} else {
		alert("no standard left turns, " + rawLefts);
	}

	console.log("standardized left turns: " + sLefts);
	return sLefts;
}


function standardizeSpeed (rawSpeed){
//standardize left turns
	var sSpeed = null;

	if (rawSpeed <= 25) { 
		sSpeed = 5;
	} else if ( rawSpeed > 25 && rawSpeed < 27 ) { 
		sSpeed = 4;
	} else if ( rawSpeed >= 27 && rawSpeed < 29 ) { 
		sSpeed = 3;
	} else if ( rawSpeed >= 29 && rawSpeed < 31 ) { 
		sSpeed = 2;
	} else if (rawSpeed >= 31 ) { 
		sSpeed = 1; 
	} else {
		alert("no standard left turns, " + rawSpeed);
	}

	console.log("standardized speed: " + sSpeed);
	return sSpeed;
}


//display information
function showStandardData (routeDictionary) {
	//shows standard data
	var html2 = "<thead><tr><th> Route ID </th><th> Standarized Distance </th><th> Standardize Lefts </th><th> Standardize Elevation </th><th> Standardize Speed </th><th> Total Score </th><tr></thead><tbody>";

	for (var i = 0; i < Object.keys(routeDictionary).length; i++) {
		var r = routeDictionary[i];
		var totalScore = r.sDistance + r.sLeftTurns + r.sElevation + r.sAverageSpeed;
		//adds a string of data that will be pushed to the popup table
		html2 += "<tr id=tableRow" + r.id +"><td>" + i + "</td><td>" + r.sDistance +  "</td><td>" + r.sLeftTurns + "</td><td>" + r.sElevation + "</td><td>" + r.sAverageSpeed + "</td><td>" + totalScore + "</td></tr>";
	}
	html2 += "</tbody>";
	$("#table_route_info").html(html2);
}


function showRawData (routeDictionary) {
	//shows raw data
	var html2 = "<thead><tr><th> Route ID </th><th> Total Distance </th><th> Total Lefts </th><th> Elevation Change </th><th> Average Speed </th><tr></thead><tbody>";

	for (var i = 0; i < Object.keys(routeDictionary).length; i++) {
		var r = routeDictionary[i];
		var totalScore = r.sDistance + r.sLeftTurns + r.sElevation + r.sAverageSpeed;
		//adds a string of data that will be pushed to the popup table
		html2 += "<tr id=tableRow"+r.id+"><td>" + i + "</td><td>" + r.distance + "</td><td>" + r.leftTurns + "</td><td>" + r.elevation + "</td><td>" + r.averageSpeed + "</td></tr>";
	}
	html2 += "</tbody>";
	$("#table_route_info").html(html2);
}


            


//remove line
//currently this deletes a line but does not move ids in hash table so that creates an issue with printing results

// function deleteLine () {
// 	currentLine = routeDict[1]; //example, should be able to delete whichever line is elected
// 	map.removeLayer(currentLine.polyline);
// 	delete routeDict[currentLine.id];
// }

    