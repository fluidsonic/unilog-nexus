'use strict';

var expect = require('expect.js');
var lib = require('../../lib');


it('console redirector can be skipped', function() {
	var consoleError = console.error;
	var consoleInfo = console.info;
	var consoleLog = console.log;
	var consoleWarn = console.warn;

	lib({ console: false });

	expect(console.error).to.be.equal(consoleError);
	expect(console.info).to.be.equal(consoleInfo);
	expect(console.log).to.be.equal(consoleLog);
	expect(console.warn).to.be.equal(consoleWarn);
});
