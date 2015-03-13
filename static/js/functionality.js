
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
			$("#add-route").html('<img src="static/img/addroute.png" />');
			$("#add-route").removeAttr('disabled');
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

		})
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



/* Formula calculates the total elevation gained and lost from
 * a set of elevation points.
 */
function netElevation(elevationPoints) {
	//calculates net elevation from a list of points
	var currentEle = elevationPoints[0];
	var totalEle = 0;	
	var totalGain = 0;
	var totalLoss = 0;
	for (var i = 1; i < elevationPoints.length; i++) {
		if (elevationPoints[i] === undefined){
			continue;
		} else{
			if ((elevationPoints[i] - currentEle) > 0) {
				totalGain += (elevationPoints[i] - currentEle);
			} else {
				totalLoss += Math.abs(elevationPoints[i] - currentEle);
			}
		 	totalEle += Math.abs(elevationPoints[i] - currentEle);
		 	currentEle = elevationPoints[i];
		 }
	 }
	console.log("total elevation" + totalEle + "gain" + totalGain + "loss" + totalLoss);
	totalGain = totalGain.toPrecision(3);
	totalLoss = totalLoss.toPrecision(3);
	totalEle = totalEle.toPrecision(3);
	return [totalEle,totalGain,totalLoss];		
}



/* Calculates average speed from a list of speed points
 * 999 represents the case when there is no data available regarding 
 * speed.  In SF this seems to only be the case on walking paths, hence
 * speed is assumed to be 10 MPH.
 */
function avgSpeed(speedPoints) {
	var totalSpeed = 0;	

	for (var i = 0; i < speedPoints.length; i++) {
	 	if (speedPoints[i] <= 25){
	 		totalSpeed += 25;
	 	} else if (speedPoints[i] > 25 && speedPoints[i] < 99){
	 		totalSpeed += speedPoints[i];
	 	} else if (speedPoints[i] === 99){
	 		totalSpeed += 45;
	 	} else if (speedPoints[i] === 999){ 

	 		totalSpeed += 10;
	 	} else {
	 		alert("issue with average speed" + speedPoints[i]);
	 	}
	 }
	var avg = totalSpeed/speedPoints.length;
	console.log("average speed: " + avg);
	avg = avg.toPrecision(2);

	return (avg);		
}



/* Standardizes elevation from a unstandaridized number
 * cutoffs (meters) are made using my best judgement and can
 * be updated.
 */
function standardizeElevation (elev) {	
	var sElev = null;

	if (elev < 40) { 
		sElev = 5;
	} else if ( elev >= 40 && elev < 80 ) { 
		sElev = 4;
	} else if ( elev >= 80 && elev < 120 ) { 
		sElev = 3;
	} else if ( elev >= 120 && elev < 160 ) { 
		sElev = 2;
	} else if (elev >= 160 ) { 
		sElev = 1; 
	} else {
		alert("no standar elevation calculated, raw elevation is: " + elev);
	}
	return sElev;
}	


/* Standardizes distance using the route between points A and B
 * and the shortest route between points A and B.
 * cutoffs (meters) are made using my best judgement and can
 * be updated.
 */
function standardizeDistance (dist, directDist) { 
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

	return responseValue;
}



/* Standardizes left turns.
 * cutoffs are made using my best judgement and can
 * be updated.
 */
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

	return sLefts;
}


/* Standardizes speed.
 * cutoffs are made using my best judgement and can
 * be updated.
 */
function standardizeSpeed (rawSpeed){
	var sSpeed = null;

	if (rawSpeed <= 20) { 
		sSpeed = 5;
	} else if ( rawSpeed > 20 && rawSpeed < 25 ) { 
		sSpeed = 4;
	} else if ( rawSpeed >= 25 && rawSpeed < 27 ) { 
		sSpeed = 3;
	} else if ( rawSpeed >= 27 && rawSpeed < 29 ) { 
		sSpeed = 2;
	} else if (rawSpeed >= 29 ) { 
		sSpeed = 1; 
	} else {
		alert("no standard left turns, " + rawSpeed);
	}

	return sSpeed;
}


/* The following functions weight each of the variables when 
 * a user updates the relative weighting.  This process ensures
 * that scores will always be out of 100 for a given route.
 */
function weightDistance(rd, weight, tw) {
	weight = parseInt(weight);
	for (var i = 0; i < Object.keys(rd).length; i++) {
		rd[i].sDistance = parseInt((standardizeDistance(rd[i].distance, rd[i].mostDirectDistance) * weight * (20/tw)).toPrecision(3));
	}
}


function weightElevation(rd, weight, tw) {
	weight = parseInt(weight);
	for (var i = 0; i < Object.keys(rd).length; i++) {
		rd[i].sElevation = parseInt((standardizeElevation(rd[i].elevation) * weight * (20/tw)).toPrecision(3));
	}
}


function weightLeft(rd, weight, tw) {
	weight = parseInt(weight);
	for (var i = 0; i < Object.keys(rd).length; i++) {
		rd[i].sLeftTurns = parseInt((standardizeLefts(rd[i].leftTurns) * weight * (20/tw)).toPrecision(3));
	}
}


function weightSpeed(rd, weight, tw) {
	weight = parseInt(weight);
	for (var i = 0; i < Object.keys(rd).length; i++) {
		rd[i].sAverageSpeed = parseInt((standardizeSpeed(rd[i].averageSpeed) * weight * (20/tw)).toPrecision(3));
	}
}


/* Function ensures that all catergories will be updated
 * when a weight for a particular variable is updated.
 */
function weightAndUpdate() {
	console.log("total weight" + totalWeight());
	weightSpeed(routeDict, sWeight, totalWeight());
	weightDistance(routeDict, dWeight, totalWeight());
	weightElevation(routeDict, eWeight, totalWeight());
	weightLeft(routeDict, lWeight, totalWeight());
	showStandardData(routeDict);
}



//display information
function showStandardData (routeDictionary) {
	//shows standard data

	var html2 = "";

	for (var i = 0; i < Object.keys(routeDictionary).length; i++) {
		var r = routeDictionary[i];
		var fixedRouteId = i + 1; //so no route 0
		var totalScore = r.sDistance + r.sLeftTurns + r.sElevation + r.sAverageSpeed;
		//adds a string of data that will be pushed to the popup table
		html2 += "<tr id=tableRow" + r.id +"><td class='rowid'>" + fixedRouteId + "</td><td>" + r.sDistance + "</td><td>" + r.sLeftTurns + "</td><td>" + r.sElevation + "</td><td>" + r.sAverageSpeed + "</td><td>" + totalScore + "</td></tr>";
	}
	html2 += "";
	$("#table_route_info").html(html2);
}



function showRawData (routeDictionary) {
	//shows raw data
	var html2 = "";

	for (var i = 0; i < Object.keys(routeDictionary).length; i++) {
		var r = routeDictionary[i];
		var directness = 100*(r.mostDirectDistance/r.distance);
		directness = directness.toPrecision(3);
		var fixedRouteId = i + 1; //so no route 0
		//adds a string of data that will be pushed to the popup table
		html2 += "<tr id=tableRow"+r.id+"><td class='rowid'>" + fixedRouteId + "</td><td>" + r.distance +  "</td><td>" + directness + "</td><td>" + r.leftTurns + "</td><td>" + r.eGain + "</td><td>" + r.eLoss + "</td><td>" + r.averageSpeed + "</td></tr>";
	}
	$("#raw_info").html(html2);

}



function drawSavedRoutes (routeDictionary,routenumber) {
		routeDict = routeDictionary;
	for (var i = 0; i < Object.keys(routeDictionary).length; i++) {
		var route = startNewLine(routenumber);
		route.polyline = 5; //this needs to be reworked
	}
	showRouteDict(routeDict);
}



//makes chart -- this should be moved to a different place


function drawChart (rd) {
//list which will contain lists of data from each line
var routeList = []; 


for (j = 0; j < Object.keys(rd).length; j++) {
	xlist = [];
	var xname = "x" + (rd[j].id + 1);
	xlist.push(xname);
	var fraction = 1.0 / (rd[j].elePoints.length - 1);
	var value = 0;

	for (i = 0; i < rd[j].elePoints.length; i++) {
		xlist.push(value);
		value += fraction;
	}
	routeList.push(xlist);
	console.log(routeList);
}



for (j = 0; j < Object.keys(rd).length; j++) {
	var name = "route" + (rd[j].id + 1);
	var elevation = rd[j].elePoints;
	var dataList = [];
	dataList.push(name);

	for (i = 0; i < elevation.length; i++) {
		if  (elevation[i] != undefined) {
			dataList.push(elevation[i].toPrecision(3));
		}
	}
	routeList.push(dataList);
	console.log(routeList);
}


var chart = c3.generate({
    bindto: '#echart',
    data: {
    	xs: {
            'route1': 'x1',
            'route2': 'x2',
            'route3': 'x3',
            'route4': 'x4',
            'route5': 'x5',
            'route6': 'x6',
            'route7': 'x7',
            'route8': 'x8',
            'route9': 'x9',
        },

      columns: routeList,
      
      colors: {
      	route1: '#4AA0D3',
      	route2: '#2C9359',
      	route3: '#9BB31C',
      	route4: '#4BBCA1',
      	route5: '#B3A81D',
      	route6: '#31938B',
      	route7: '#4AD35A',
      	route8: '#99C946',
      	route9: '#ABE345'
      }
    },
    axis: {
    	y: {
    		label: {
    			text: "elevation (meters)",
    			position: "outer-middle"
    		}
    	},
    	x: {
    		label: {
    			text: "route destination",
    			position: "outer-middle"
    		},
    		tick: {
    			values: ["route origin"],
    			position: "outer-middle"
    		}
    	}
    },
    tooltip: {
        format: {
            title: function (d) { return "elevation"; }
        }
    }
});

}

    