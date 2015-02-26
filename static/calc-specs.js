describe("standardizeData", function () {

 beforeEach(function () {
 	var currentLine = new line(1);

 	currentLine.distance = 100;
 	currentLine.mostDirectDistance = 75;
 	currentLine.leftTurns = 6;


	//standardized values
	//this.sElevation = null;
	//this.sDistance = null;
	//this.sLeftTurns = null;

 });


 it("should add nubmers", function () {

 expect(standardizeData(currentLine)).toBeDefined();

 });

});