'use strict';

var capture = require('../helpers/capture');
var expect = require('expect.js');
var lib = require('../../lib');


it('debug redirector redirects debug() when module already loaded', function() {
	require('debug');

	lib({ console: false });

	var debug = require('debug')('a:b:c');

	capture(function() {
		debug('a test message');
	}, function(events) {
		expect(events.length).to.be.equal(1);

		expect(events[0]).to.have.property('callee',  debug);
		expect(events[0]).to.have.property('groupId', 'a.b.c');
		expect(events[0]).to.have.property('level',   'debug');
		expect(events[0]).to.have.property('message', 'a test message');
	});
});
