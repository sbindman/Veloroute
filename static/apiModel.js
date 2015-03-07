//api connections

// Put somewhere in your scripting environment. used to return a list of deferred objects
//http://stackoverflow.com/questions/5627284/pass-in-an-array-of-deferreds-to-when
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
    }
}



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

	//this might just need to be defer not defer.promise()
	return defer.promise();
}


function calcElevation (route) {

	// calculates overall elevation
	var totalEle = 0; //does not take into account total positive or total neg
	var routePoints = routeDict[route.id].coordinates;
	var elevPoints = [];
	var deferred = $.Deferred();

	//results is currently only showing last item
	var deferreds = routePoints.map(getElevation);

	$.when.all(deferreds).done(function (result) {
		console.log("done", deferreds, result);
		elevPoints = result;
		deferred.resolve(elevPoints);
	});
	return deferred.promise();
}


	
	

function getSpeedLimit(point) {
	var defer = $.Deferred();
	
	// function that returns speed for a given point
	var speed_url = 'https://api.tiles.mapbox.com/v4/surface/sbindman.e7527b3f.json?layer=MTA_DPT_SpeedLimits&fields=speedlimit&access_token=pk.eyJ1IjoiZHVuY2FuZ3JhaGFtIiwiYSI6IlJJcWdFczQifQ.9HUpTV1es8IjaGAf_s64VQ&points='+ point[0]+','+ point[1] +'&zoom=17&interpolate=true';
	console.log(speed_url);

	$.get(speed_url, function (result) {
		var speed_limit = result.results[0].speedlimit;
		console.log("get speed: " + speed_limit);
		defer.resolve(speed_limit);
	}).fail( function() {
		alert("error with getting speed");
	});

	//this might just need to be defer not defer.promise()
	return defer.promise();
}


	

function calcSpeed (route) {
	// calculates average speed along a route
	var totalSpeed = 0; //does not take into account total positive or total neg
	var speedRoutePoints = routeDict[route.id].coordinates;
	var speedPoints = [];
	var defer4 = $.Deferred();

	var defer_list = speedRoutePoints.map(getSpeedLimit);

	$.when.all(defer_list).done(function (result) {
		console.log("finished", defer_list, result);
		speedPoints = result;
		defer4.resolve(speedPoints);
	});
	return defer4.promise();
}


//show traffic density data
//Daily vehicle count per mile of street segment aggregated at the U.S. Census Tract level in San Francisco, CA.
//https://data.sfgov.org/Transportation/Traffic-Density-San-Francisco-CA/rhp4-jr7s?category=Transportation&view_name=Traffic-Density-San-Francisco-CA
// "https://api.tiles.mapbox.com/v4/surface/sbindman.e7527b3f.json?layer=SanFranciscoTrafficDensity_2010CensusTracts&fields=Area_A,Area_smi,Shape_Area,Shape_Leng,StreetLe_1,StreetLeng,Sum_Shape_,TotalTfcCn,Tract2010,Tract2010_,TrfcCnt_Mi&access_token=pk.eyJ1IjoiZHVuY2FuZ3JhaGFtIiwiYSI6IlJJcWdFczQifQ.9HUpTV1es8IjaGAf_s64VQ&points=-122.46889114379881,37.76501541890696;-122.44760513305664,37.782383403274565;-122.43867874145509,37.77207165460911&zoom=17&interpolate=true"



