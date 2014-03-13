'use strict';

var capture = require('../helpers/capture');
var expect = require('expect.js');
var lib = require('../../lib');
var Util = require('util');


it('console redirector redirects .debug, .info, .log and .error', function() {
	var consoleError = console.error;
	var consoleInfo = console.info;
	var consoleLog = console.log;
	var consoleWarn = console.warn;

	lib();

	var error = new Error();

	capture(function() {
		console.info('another: %s', 'test');
		console.log('log statement');
		console.warn({ thisIsA: 'warn test' }, 'foo');
		console.error('error happened!', error);
	}, function(events) {
		// revert hooks to not capture test output
		var infoOverride = console.info;
		var logOverride = console.log;
		var warnOverride = console.warn;
		var errorOverride = console.error;
		console.error = consoleError;
		console.info = consoleInfo;
		console.log = consoleLog;
		console.warn = consoleWarn;

		expect(events.length).to.be.equal(4);

		expect(events[0]).to.have.property('callee', infoOverride);
		expect(events[0]).to.have.property('level', 'info');
		expect(events[0]).to.have.property('message', Util.format('another: %s', 'test'));

		expect(events[1]).to.have.property('callee', logOverride);
		expect(events[1]).to.have.property('level', 'info');
		expect(events[1]).to.have.property('message', Util.format('log statement'));

		expect(events[2]).to.have.property('callee', warnOverride);
		expect(events[2]).to.have.property('level', 'warn');
		expect(events[2]).to.have.property('message', Util.format({ thisIsA: 'warn test' }, 'foo'));

		expect(events[3]).to.have.property('callee', errorOverride);
		expect(events[3]).to.have.property('level', 'error');
		expect(events[3]).to.have.property('message', Util.format('error happened!', error));

		expect(infoOverride.raw).to.be.a('function');
		expect(logOverride.raw).to.be.a('function');
		expect(warnOverride.raw).to.be.a('function');
		expect(errorOverride.raw).to.be.a('function');
	});
});
