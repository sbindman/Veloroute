//setting up objects and global variables

//global variables
var routeNum = 0;
var currentLine = null;
// var points = [];


var colors = ['#793FFF', '#394EE8', '#4CAAFF', '#39DCE8', '#33FFB4'];

//tests
var routeDict = {};


//constructor for a new line object
function line(id) {
	this.id = id;
	this.name = null;
	var lineColor = colors[id];
	this.polyline = L.polyline([], { color:lineColor, weight:5.5, opacity:.8 }).addTo(map);
	this.waypoints = [];
	this.elevation = null;
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


var circleIcon = L.icon({
    iconUrl: '/static/icon2.png',
    iconSize:     [40, 40], // size of the icon
   	// iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
});

