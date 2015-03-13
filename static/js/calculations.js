/* Formula calculates the total elevation gained and lost from
 * a set of elevation points.
 */
function netElevation(elevationPoints) {
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

	if (elev < 50) { 
		sElev = 5;
	} else if ( elev >= 50 && elev < 100 ) { 
		sElev = 4;
	} else if ( elev >= 100 && elev < 150 ) { 
		sElev = 3;
	} else if ( elev >= 150 && elev < 200 ) { 
		sElev = 2;
	} else if (elev >= 200 ) { 
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