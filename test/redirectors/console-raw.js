'use strict';

var expect = require('expect.js');
var lib = require('../../lib');


it('console redirector exposes raw functions', function() {
	var consoleError = console.error;
	var consoleInfo = console.info;
	var consoleLog = console.log;
	var consoleWarn = console.warn;

	lib();

	// revert hooks to not capture test output
	var infoOverride = console.info;
	var logOverride = console.log;
	var warnOverride = console.warn;
	var errorOverride = console.error;
	console.error = consoleError;
	console.info = consoleInfo;
	console.log = consoleLog;
	console.warn = consoleWarn;

	expect(infoOverride.raw).to.be.a('function');
	expect(logOverride.raw).to.be.a('function');
	expect(warnOverride.raw).to.be.a('function');
	expect(errorOverride.raw).to.be.a('function');
});
