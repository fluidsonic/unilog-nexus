'use strict';

var expect = require('expect.js');
var lib = require('../../lib');


it('debug redirector can be skipped', function() {
	var debug = require('debug');

	lib({ console: false, debug: false });

	expect(require('debug')).to.be.equal(debug);
});
