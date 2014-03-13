'use strict';

var expect = require('expect.js');
var lib = require('../../lib');


it('nlogger redirector can be skipped', function() {
	var logger = require('nlogger').logger;

	lib({ console: false, nlogger: false });

	expect(require('nlogger').logger).to.be.equal(logger);
});
