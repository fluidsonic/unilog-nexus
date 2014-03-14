'use strict';

var expect = require('expect.js');
var lib = require('../lib');


it('different redirects can be enabled in different calls but at most once', function() {
	var consoleError = console.error;
	var consoleInfo = console.info;
	var consoleLog = console.log;
	var consoleWarn = console.warn;

	expect(console.log.raw).to.not.be.ok();

	lib({ console: false });
	expect(console.log.raw).to.not.be.ok();

	lib();
	var raw = console.log.raw;
	expect(raw).to.be.a('function');

	lib();
	expect(console.log.raw).to.be.equal(raw);
	expect(console.log.raw).to.not.have.property('raw');

	// revert hooks to not capture test output
	console.error = consoleError;
	console.info = consoleInfo;
	console.log = consoleLog;
	console.warn = consoleWarn;
});
