describe("standardize", function () {

 // beforeEach(function () {
 // 	var currentLine = new line(1);

 // 	currentLine.distance = 100;
 // 	currentLine.mostDirectDistance = 75;
 // 	currentLine.leftTurns = 6;


	// //standardized values
	// //this.sElevation = null;
	// //this.sDistance = null;
	// //this.sLeftTurns = null;

 // });


 it("should standardize elevation", function () {

 expect(standardizeElevation(100).toBeDefined(3);
 expect(standardizeElevation("balloon").toBeDefined(null);
 
 });


 it("should standardize distance", function () {

 expect(standardizeDistance(100, 50).toBeDefined(1);
 expect(standardizeDistance(55, 50).toBeDefined(3);
 expect(standardizeDistance("banana", 50).toBeDefined(null);

 });



 it("should standardize lefts", function () {

 expect(standardizeLefts(7).toBeDefined(2);
 expect(standardizeLefts("balloonicorn").toBeDefined(null);



 });


});