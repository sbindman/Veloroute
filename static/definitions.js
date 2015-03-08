//setting up objects and global variables

//global variables
var routeNum = 0;
var currentLine = null;
// var points = [];


var colors = ['#4AA0D3', '#2C9359', '#9BB31C', '#4BBCA1', '#B3A81D', '#31938B', '#4AD35A', '#99C946', '#ABE345'];

//tests
var routeDict = {};

//stores state of table
var tableopen = false;


//constructor for a new line object

/* Creates a line object 
 *
 *
 *
 */
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
    iconUrl: '/static/img/icon2.png',
    iconSize:     [20, 20], // size of the icon
   	// iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
});

