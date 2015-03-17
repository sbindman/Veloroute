
//TESTS
describe("standardize", function () {

	it("should standardize elevation", function () {

	expect(standardizeElevation(100)).toBeDefined(2);
	expect(standardizeElevation("balloon")).toBeDefined(null);

	});


	it("should standardize distance", function () {

	expect(standardizeDistance(100, 50)).toBeDefined(1);
	expect(standardizeDistance(105, 100)).toBeDefined(5);
	expect(standardizeDistance("banana", 50)).toBeDefined(null);

	});


	it("should standardize lefts", function () {

	expect(standardizeLefts(7)).toBeDefined(2);
	expect(standardizeLefts("balloonicorn")).toBeDefined(null);

	});


	it("should standardize speed", function () {

	expect(standardizeSpeed(25)).toBeDefined(5);

	});

});



describe("calculations", function () {

	it("should calc elevation info", function () {
	expect(netElevation([10,20,10])).toBeDefined([20,10,10]);
	});


	it("should calculate average speed", function () {
	expect(avgSpeed([10,35])).toBeDefined(30);
	expect(avgSpeed([999,40])).toBeDefined(25);
		expect(avgSpeed([99,45])).toBeDefined(45);
	});

});