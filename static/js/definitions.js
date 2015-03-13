//setting up objects and global variables

//global variables
var routeNum = 0;
var currentLine = null;
var routeDict = {};

var colors = ['#4AA0D3', '#2C9359', '#9BB31C', '#4BBCA1', '#B3A81D', '#31938B', '#4AD35A', '#99C946', '#ABE345'];



//stores state of table
var tableopen = false;
var aboutOpen = false;
var helpOpen = false;

 var lWeight = 1;
 var dWeight = 1;
 var sWeight = 1;
 var eWeight = 1;

 var totalWeight = function () {
   return lWeight + dWeight + sWeight + eWeight;
}



/* constructor for a new line object
 */
function line(id) {
	this.id = id;
	this.name = null;
	var lineColor = colors[id];
	this.polyline = L.polyline([], { color:lineColor, weight:5.5, opacity:.8 }).addTo(map);
	this.waypoints = [];
	this.elePoints = null;
	this.elevation = null;
	this.eGain = null;
	this.eLoss = null;
	this.distance = null;
	this.mostDirectDistance = null;
	this.averageSpeed = null;
	this.leftTurns = null;
	this.coordinates = [];

	//standardized values
	this.sElevation = null;
	this.sDistance = null;
	this.sLeftTurns = null;
	this.sAverageSpeed = null;
}


/* custom icon used for markers
 */
var circleIcon = L.icon({
    iconUrl: '/static/img/icon2.png',
    iconSize:     [20, 20]
});

