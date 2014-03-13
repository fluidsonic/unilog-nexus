'use strict';

var expect = require('expect.js');
var lib = require('../../lib');


it('debug redirector exposes raw functions', function() {
	var rawDebug = require('debug');

	lib({ console: false });

	var debug = require('debug');
	var debugInstance = debug('a:b:c');

	expect(debug.raw).to.be.equal(rawDebug);
	expect(debugInstance.raw).to.be.a('function');
});
