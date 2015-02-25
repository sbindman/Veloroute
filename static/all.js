//global variables
var routeNum = 0;
var currentLine = null;
// var points = [];
var colors = ['#793FFF', '#394EE8', '#4CAAFF', '#39DCE8', '#33FFB4'];

//tests
var routeDict = {};


//api connections

function showElevation(point) {
	//This function that (calculates) displays elevation for a given point
	var elevation_url = 'https://api.tiles.mapbox.com/v4/surface/mapbox.mapbox-terrain-v1.json?layer=contour&fields=ele&points='+point.lng+','+point.lat+'&access_token=pk.eyJ1Ijoic2JpbmRtYW4iLCJhIjoiaENWQnlrVSJ9.0DQyCLWgA0j8yBpmvt3bGA';
	$.get(elevation_url, function (result) {
		elevation = result.results[0].ele;
		$("#map-results").text(elevation);
	return elevation;
	});
}


function getDistanceAndLefts(route) { 
	//This function calculates the total distance and number of left turns for a given route
	var defer1 = $.Deferred();
	var direction_url = routeDict[route.id].directionUrl;
	var distance = null;
	var leftTurns = 0;
	var mostDirectDistance = null; //FIXIT this should be cleaned up to be null and connected to a specific object
	$.when($.get(direction_url)).done( function (result) {
		distance = result.routes[0].distance; //distance is in meters, route 0 is the "optimal" route
		routeDict[route.id].distance = distance //distance stored in miles


		for (var i = 0; i < result.routes[0].steps.length; i++) {
		 	if (result.routes[0].steps[i].maneuver.type.match(/left/g)) {
		 		leftTurns += 1;
		 	}
		}
		routeDict[route.id].leftTurns = leftTurns;

		console.log("distance" + distance);
		console.log("left turns: " + leftTurns);
		defer1.resolve();
	});	
	defer1.promise();
}


function getDirectRouteRatio(route) {
	//This function calculates a ratio between a given route and the most direct route between 2 points
	var defer2 = $.Deferred();
	var startPoint = routeDict[route.id].waypoints[0].getLatLng();
	var endPoint = routeDict[route.id].waypoints[routeDict[route.id].waypoints.length -1].getLatLng(); //end point in waypoints

	//calculate the most direct route distance for start and end points
 	var mostDirectDirection_url = 'http://api.tiles.mapbox.com/v4/directions/mapbox.walking/'+ startPoint.lng + ',' + startPoint.lat + ';' + endPoint.lng + ',' + endPoint.lat + '.json?access_token=pk.eyJ1Ijoic2JpbmRtYW4iLCJhIjoiaENWQnlrVSJ9.0DQyCLWgA0j8yBpmvt3bGA'

 	$.when($.get(mostDirectDirection_url)).done(function (result) {
 		mostDirectDistance = result.routes[0].distance;
 		routeDict[route.id].mostDirectDistance = mostDirectDistance;
 		defer2.resolve();
 	});
 	return defer2.promise();
 }





// function getSpeedLimit(point, callback) {
// 	//function that returns speed limit at a given point
// 	var speedUrl = 'https://api.tiles.mapbox.com/v4/surface/sbindman.e7527b3f.json?layer=MTA_DPT_SpeedLimits&fields=speedlimit&access_token=pk.eyJ1IjoiZHVuY2FuZ3JhaGFtIiwiYSI6IlJJcWdFczQifQ.9HUpTV1es8IjaGAf_s64VQ&points='+ point[0]+','+ point[1] +'&zoom=17&interpolate=true'

// 	console.log(speedUrl);

// 	$.get(speedUrl, function (answer) {
// 		var speed = answer.results[0].speedlimit;
// 		console.log("get speed limit: " + speed);
// 		return callback(undefined, speed);
// 	});
// }


// function calcAverageSpeed (route) {
// 	// calculates overall elevation
// 	//FIXIT this calculation is not working
// 	var avgSpeed = 0; //does not take into account total positive or total neg
// 	var speedPoints = [5,6];
// 	var speedRoutePoints = routeDict[route.id].coordinates;
// 	console.log("route points" + speedRoutePoints[0]);
// 	for (var i = 0; i < speedRoutePoints.length; i++) {
// 		var pointSpeed = getSpeedLimit(speedRoutePoints[i], function(err, ele) {
// 			console.log("point speed" + pointSpeed);
// 			if (parseInt(pointSpeed) > 0) {
// 			speedPoints.push(pointSpeed);
// 			} else {
// 				console.log("not added: " + pointSpeed);
// 			}
// 		});
// 	}

// 	setTimeout(function () {  //FIXIT add in async
// 		var totalSpeed = 0;
// 		console.log("length speed points" + speedPoints.length);
	
// 	for (var i = 0; i < speedPoints.length; i++) {
// 		totalSpeed += speedPoints[i];
// 		}

// 	avgSpeed = totalSpeed / speedPoints.length;
// 	console.log("average speed" + avgSpeed);

// 	//routeDict[route.id].elevation = totalEle;
// 		} , 1000);	
// }


function getElevation(point, callback) {
	// function that (calculates) displays elevation for a given point
	var elevation_url = 'https://api.tiles.mapbox.com/v4/surface/mapbox.mapbox-terrain-v1.json?layer=contour&fields=ele&points='+ point[0]+','+ point[1] +'&access_token=pk.eyJ1Ijoic2JpbmRtYW4iLCJhIjoiaENWQnlrVSJ9.0DQyCLWgA0j8yBpmvt3bGA';
	console.log(elevation_url);

	$.get(elevation_url, function (result) {
		var elevation = result.results[0].ele;
		console.log("get elevation: " + elevation);
		return callback(undefined, elevation);
	});
}

function calcElevation (route) {
	// calculates overall elevation
	var totalEle = 0; //does not take into account total positive or total neg
	var elevationPoints = [];
	var routePoints = routeDict[route.id].coordinates;
	console.log("route points" + routePoints[0]);
	console.log("rp"+routePoints);
	var counter = 0;
	for (var j = 0; j < routePoints.length; j++) {
		var elev = getElevation(routePoints[counter], function(err, ele) {
			elevationPoints.push(elev);
			counter += 1;
			
		});
	}

	setTimeout(function () {  //FIXIT add in async
	var currentEle = elevationPoints[0];
	for (var i = 1; i < routePoints.length; i++) {
		totalEle += Math.abs(elevationPoints[i] - currentEle);
		 console.log ("total elev: " + elevationPoints[0]);
		// console.log ("total: " + elevationPoints[1]);
		// console.log ("lev: " + currentEle);
		// console.log ("total elevation: " + totalEle);
		currentEle = elevationPoints[i];
	}
	routeDict[route.id].elevation = totalEle;
		} , 2000);	
	
}




//constructor for a new line object
function line(id) {
	this.id = id;
	this.name = null;
	var lineColor = colors[id];
	this.polyline = L.polyline([], { color:lineColor, weight:5.5, opacity:.8}).addTo(map);
	this.waypoints = [];
	this.elevation = null;
	this.distance = null;
	this.mostDirectDistance = null;
	this.leftTurns = null;
	this.coordinates = [];

	//standardized values
	this.sElevation = null;
	this.sDistance = null;
	this.sLeftTurns = null;
}


var circleIcon = L.icon({
    iconUrl: '/static/icon.png',
    iconSize:     [30, 30], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
});


//general functions

//create a new line object
function startNewLine() {
	var polyline = new line(routeNum);
	currentLine = polyline;
	routeDict[currentLine.id] = currentLine;
}


 function endLine() {

	$.when(getDistanceAndLefts(currentLine),getDirectRouteRatio(currentLine)).then(standardizeData(currentLine)).done(function () {
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
	  	console.log("point string" + waypointsString);

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



function standardizeData (route) {
	//will run through all of the routes and update all of the attributes to have an additional field with standardized rather than raw values
	var rawElevation = routeDict[route.id].elevation;
	var rawDistance = routeDict[route.id].distance;
	var rawDirectDistance = routeDict[route.id].mostDirectDistance;
	var rawLefts = routeDict[route.id].leftTurns;
	var ratio = rawDistance / rawDirectDistance;

	//standarize elevation -- these value cutoffs can be changed but seem reasonable
	
	if (rawElevation < 100) { 
		routeDict[route.id].sElevation = 3;
	} else if ( rawElevation >= 100 && rawElevation < 150 ) { 
		routeDict[route.id].sElevation = 2;
	} else if (rawElevation >= 150 ) { 
		routeDict[route.id].sElevation = 1; 
	} else {
		routeDict[route.id].sElevation = null;
	}

	console.log("standardized elevation: " + routeDict[route.id].sElevation);
	
	//standardize distance -- these value cutoffs can be changed but seem reasonable
	if (ratio < 1) { 
		routeDict[route.id].sDistance = null;
		console.log ("Error");
	} else if ( ratio >= 1 && ratio < 1.3) { 
		routeDict[route.id].sDistance = 3;
	} else if (ratio >= 1.3 && ratio < 1.6 ) { 
		routeDict[route.id].sDistance = 2;
	} else if (ratio >= 1.6) { 
		routeDict[route.id].sDistance = 1;  
	} else {
		routeDict[route.id].sElevation = null;
	}

	console.log("standardized distance: " + routeDict[route.id].sDistance);


//standardize left turns
	if (rawLefts < 5) { 
		routeDict[route.id].sLeftTurns = 3;
	} else if ( rawLefts >= 5 && rawLefts < 10 ) { 
		routeDict[route.id].sLeftTurns = 2;
	} else if (rawElevation >= 10 ) { 
		routeDict[route.id].sLeftTurns = 1; 
	} else {
		routeDict[route.id].sLeftTurns = null;
	}

	console.log("standardized left turns: " + routeDict[route.id].sLeftTurns);

}


//display information
function showRouteDict () {
	var html = "";
	for (var i = 0; i < Object.keys(routeDict).length; i++) {
		html += '<div> id: ' + i + "  route elevation: " + routeDict[i].elevation +  " route distance: " + routeDict[i].distance + " route left turns: " + routeDict[i].leftTurns + ' standardized elevation:' + routeDict[i].sElevation + "  standardized distance: " + routeDict[i].sDistance +  " standardized left turns: " + routeDict[i].sleftTurns + '</div>';
	}
	$("#route-info").html(html);
}





//button on the page

//button that starts a new route
$("#add-route").on("click", startNewLine);
$("#calcElevation").on("click", calcElevation);
$("#routes").on("click", showRouteDict);

//remove route
//$("#remove-route").on("click", deleteLine);

//show elevation on click
map.on('click', function(evt) {
	showElevation(evt.latlng);
});

map.on('click', addMarker);
map.on('dblclick', endLine);





