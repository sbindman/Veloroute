//api connections


function getDistanceAndLefts(route) { 
	//This function calculates the total distance and number of left turns for a given route
	var defer = $.Deferred();
	var direction_url = routeDict[route.id].directionUrl;
	var distance = null;
	var leftTurns = 0;
	var mostDirectDistance = null; //FIXIT this should be cleaned up to be null and connected to a specific object
	$.when($.get(direction_url)).done( function (result) {
		distance = result.routes[0].distance; //distance is in meters, route 0 is the "optimal" route

		for (var i = 0; i < result.routes[0].steps.length; i++) {
		 	if (result.routes[0].steps[i].maneuver.type.match(/left/g)) {
		 		leftTurns += 1;
		 	}
		}

		console.log("distance" + distance);
		console.log("left turns: " + leftTurns);
		defer.resolve([distance, leftTurns]);
	}).fail( function() {
		alert("get distance and lefts error");
	});	
	return defer.promise();
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
 		defer2.resolve(mostDirectDistance);
 	}).fail( function() {
 		alert("error with get direct route ratio");
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


function getElevation(point) {
	var defer = $.Deferred();
	// function that (calculates) displays elevation for a given point
	var elevation_url = 'https://api.tiles.mapbox.com/v4/surface/mapbox.mapbox-terrain-v1.json?layer=contour&fields=ele&points='+ point[0]+','+ point[1] +'&access_token=pk.eyJ1Ijoic2JpbmRtYW4iLCJhIjoiaENWQnlrVSJ9.0DQyCLWgA0j8yBpmvt3bGA';
	console.log(elevation_url);

	$.get(elevation_url, function (result) {
		var elevation = result.results[0].ele;
		console.log("get elevation: " + elevation);
		defer.resolve(elevation);
	}).fail( function() {
		alert("error with getting elevation");
	});
	return defer.promise();
}

function calcElevation (route) {
	var defer = $.Deferred();
	var elevationPoints = [];
	// calculates overall elevation
	var totalEle = 0; //does not take into account total positive or total neg
	var routePoints = routeDict[route.id].coordinates;

	for (var j = 0; j < routePoints.length; j++) {
		$.when( getElevation(routePoints[j] ) 
		).then(function (result) {
			elev = result;
			//console.log("elev" + elev);	
			elevationPoints.push(elev);
		}).done( function () {
			console.log("about to be resolved");
			defer.resolve(elevationPoints);
			
		}).fail( function () {
			alert("error with calc elevation");
		});
		return defer.promise();
	}


// function showElevation(point) {
// 	//This function that (calculates) displays elevation for a given point
// 	var elevation_url = 'https://api.tiles.mapbox.com/v4/surface/mapbox.mapbox-terrain-v1.json?layer=contour&fields=ele&points='+point.lng+','+point.lat+'&access_token=pk.eyJ1Ijoic2JpbmRtYW4iLCJhIjoiaENWQnlrVSJ9.0DQyCLWgA0j8yBpmvt3bGA';
// 	$.get(elevation_url, function (result) {
// 		elevation = result.results[0].ele;
// 		$("#map-results").text(elevation);
// 	return elevation;
// 	});
// }


	
	// console.log("elevation points length: " + elevationPoints.length);	
	// var currentEle = elevationPoints[0];	
	// for (var i = 1; i < elevationPoints.length; i++) {
	// 	totalEle += Math.abs(elevationPoints[i] - currentEle);
	// 	 console.log ("total elev: " + elevationPoints[i]);
	// 	currentEle = elevationPoints[i];

	// }
	// routeDict[route.id].elevation = totalEle;
	// console.log("total elevation" + routeDict[route.id].elevation);		

		
	}



// function calcElevation (route) {
// 	// calculates overall elevation
// 	var totalEle = 0; //does not take into account total positive or total neg
// 	var elevationPoints = [];
// 	var routePoints = routeDict[route.id].coordinates;
// 	console.log("route point length: " + routePoints.length);
// 	console.log("route points" + routePoints[0]);
// 	console.log("rp"+routePoints);
// 	var counter = 0;
// 	for (var j = 0; j < routePoints.length; j++) {
// 		var elev = getElevation(routePoints[counter], function(err, ele) {
// 			elevationPoints.push(elev);
// 			counter += 1;
			
// 		});
// 	}

// 	setTimeout(function () {  //FIXIT add in async
// 	var currentEle = elevationPoints[0];
// 	for (var i = 1; i < routePoints.length; i++) {
// 		totalEle += Math.abs(elevationPoints[i] - currentEle);
// 		 console.log ("total elev: " + elevationPoints[0]);
// 		// console.log ("total: " + elevationPoints[1]);
// 		// console.log ("lev: " + currentEle);
// 		// console.log ("total elevation: " + totalEle);
// 		currentEle = elevationPoints[i];
// 	}
// 	routeDict[route.id].elevation = totalEle;
// 		} , 2000);	
	
// }

// $.when(v1, v2, v3)    // "variadic" == ? of parameters

// $.when([d1, d2]) 

// unscore 

