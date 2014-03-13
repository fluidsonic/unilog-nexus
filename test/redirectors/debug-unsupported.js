'use strict';

var expect = require('expect.js');
var lib = require('../../lib');
var poison = require('poison');


it('debug redirector ignores unsupported debug module', function() {
	var originalDebug = require('debug');
	var fakeDebug = { someUnknown: 'debugModule' };

	poison.getModulesByName('debug').forEach(function(mod) {
		if (mod.exports === originalDebug) {
			mod.exports = fakeDebug;
		}
	});

	lib({ console: false });

	var debug = require('debug');
	expect(debug).to.be.equal(fakeDebug);
});
