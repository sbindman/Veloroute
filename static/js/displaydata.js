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

    