/* function which converts a deferred object into a array
 * source: http://stackoverflow.com/questions/5627284/pass-in-an-array-of-deferreds-to-when
 */
if (jQuery.when.all===undefined) {
    jQuery.when.all = function(deferreds) {
        var deferred = new jQuery.Deferred();
        $.when.apply(jQuery, deferreds).then(
            function() {
                deferred.resolve(Array.prototype.slice.call(arguments));
            },
            function() {
                deferred.fail(Array.prototype.slice.call(arguments));
            });
        return deferred;
    };
}


/* This function calculates the total distance
 * and number of left turns for a given route
 */
function getDistanceAndLefts(route) { 
	var defer = $.Deferred();
	var direction_url = routeDict[route.id].directionUrl;
	var distance = null;
	var leftTurns = 0;
	var mostDirectDistance = null;
	$.when($.get(direction_url)).done( function (result) {
		distance = result.routes[0].distance; //distance is in meters, route 0 is the "optimal" walking route

		for (var i = 0; i < result.routes[0].steps.length; i++) {
		 	if (result.routes[0].steps[i].maneuver.type.match(/left/g)) {
		 		leftTurns += 1;
		 	}
		}
		defer.resolve([distance, leftTurns]);
	}).fail( function() {
		//alert("get distance and lefts error"); //this should be used for debugging
	});	
	return defer.promise();
}


/* This function calculates a ratio between a given
 * route and the most direct route between 2 points
 */
function getDirectRouteRatio(route) {
	var defer = $.Deferred();
	var startPoint = routeDict[route.id].waypoints[0].getLatLng();
	var endPoint = routeDict[route.id].waypoints[routeDict[route.id].waypoints.length -1].getLatLng();
 	var mostDirectDirection_url = 'http://api.tiles.mapbox.com/v4/directions/mapbox.walking/'+ startPoint.lng + ',' + startPoint.lat + ';' + endPoint.lng + ',' + endPoint.lat + '.json?access_token=pk.eyJ1Ijoic2JpbmRtYW4iLCJhIjoiaENWQnlrVSJ9.0DQyCLWgA0j8yBpmvt3bGA';

 	$.when($.get(mostDirectDirection_url)).done(function (result) {
 		mostDirectDistance = result.routes[0].distance;
 		defer.resolve(mostDirectDistance);
 	}).fail( function() {
 		//alert("error with get direct route ratio"); //this should be used for debugging
 	});
 	return defer.promise();
 }


/* function that returns the elevation for a given
 * point by calling a mapbox API request. 
 */ 
function getElevation(point) {
	var defer = $.Deferred();
	var elevation_url = 'https://api.tiles.mapbox.com/v4/surface/mapbox.mapbox-terrain-v1.json?layer=contour&fields=ele&points='+ point[0]+','+ point[1] +'&access_token=pk.eyJ1Ijoic2JpbmRtYW4iLCJhIjoiaENWQnlrVSJ9.0DQyCLWgA0j8yBpmvt3bGA';

	$.get(elevation_url, function (result) {
		if (result.results.length > 0) {
		var elevation = result.results[0].ele;
		defer.resolve(elevation);
		} else {
			defer.resolve();
		}
	}).fail( function() {
		//alert("error with getting elevation"); //this should be used for debugging
	});
	return defer.promise();
}


/* function returns an array of elevations 
 * for points along a route.
 */ 
function calcElevation (route) {
	var totalEle = 0;
	var routePoints = routeDict[route.id].coordinates;
	var elevPoints = [];
	var deferred = $.Deferred();
	var deferreds = routePoints.map(getElevation);

	$.when.all(deferreds).done(function (result) {
		elevPoints = result;
		deferred.resolve(elevPoints);
	});
	return deferred.promise();
}


/* function that returns speed limit for a given
 * point by calling a mapbox API request. If no
 * speed is found, an empty array is returned
 */ 
function getSpeedLimit(point) {
	var defer = $.Deferred();
	var speed_url = 'https://api.tiles.mapbox.com/v4/surface/sbindman.e7527b3f.json?layer=MTA_DPT_SpeedLimits&fields=speedlimit&access_token=pk.eyJ1IjoiZHVuY2FuZ3JhaGFtIiwiYSI6IlJJcWdFczQifQ.9HUpTV1es8IjaGAf_s64VQ&points='+ point[0]+','+ point[1] +'&zoom=17&interpolate=true';
	$.get(speed_url, function (result) {
		if (result.results.length > 0 ) {
			var speed_limit = result.results[0].speedlimit;
			defer.resolve(speed_limit);
		} else {
			defer.resolve(999); //passes a dummy code if no value is returned
		}
	}).fail( function() {
		//alert("error with getting speed"); //this should be used for debugging
	});
	return defer.promise();
}

	
/* function returns an array of speed limits 
 * for points along a route.
 */ 
function calcSpeed (route) {
	var totalSpeed = 0; 
	var speedRoutePoints = routeDict[route.id].coordinates;
	var speedPoints = [];
	var defer = $.Deferred();

	var defer_list = speedRoutePoints.map(getSpeedLimit);

	$.when.all(defer_list).done(function (result) {		
		speedPoints = result;
		defer.resolve(speedPoints);
	});
	return defer.promise();
}


