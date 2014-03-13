'use strict';

var expect = require('expect.js');
var lib = require('../../lib');


it('nlogger redirector exposes raw logger', function() {
	var nlogger = require('nlogger');

	lib({ console: false });

	expect(nlogger.logger.raw).to.be.a('function');
});
