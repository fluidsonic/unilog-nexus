'use strict';

var expect = require('expect.js');
var lib = require('../../lib');
var poison = require('poison');


it('nlogger redirector ignores unsupported nlogger module', function() {
	var originalNlogger = require('nlogger');
	var fakeNlogger = { someUnknown: 'nloggerModule' };

	poison.getModulesByName('nlogger').forEach(function(mod) {
		if (mod.exports === originalNlogger) {
			mod.exports = fakeNlogger;
		}
	});

	lib({ console: false });

	var nlogger = require('nlogger');
	expect(nlogger).to.be.equal(fakeNlogger);
});
