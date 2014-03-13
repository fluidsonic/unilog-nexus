'use strict';

var capture = require('../helpers/capture');
var expect = require('expect.js');
var lib = require('../../lib');


it('nlogger redirector redirects nlogger.logger() when module already loaded', function() {
	require('nlogger');

	lib({ console: false });

	var log = require('nlogger').logger(module);

	capture(function() {
		log.trace('trace message', 1, false, {});
		log.debug('debug message', 1, false, {});
		log.info('info message',   1, false, {});
		log.warn('warn message',   1, false, {});
		log.error('error message', 1, false, {});
	}, function(events) {
		expect(events.length).to.be.equal(5);

		expect(events[0]).to.have.property('callee', log.trace);
		expect(events[0]).to.have.property('module', module);
		expect(events[0]).to.have.property('level',  'trace');
		expect(events[0]).to.have.property('message');
		expect(events[0].message).to.be.eql(['trace message', 1, false, {}]);

		expect(events[1]).to.have.property('callee', log.debug);
		expect(events[1]).to.have.property('module', module);
		expect(events[1]).to.have.property('level',  'debug');
		expect(events[1]).to.have.property('message');
		expect(events[1].message).to.be.eql(['debug message', 1, false, {}]);

		expect(events[2]).to.have.property('callee', log.info);
		expect(events[2]).to.have.property('module', module);
		expect(events[2]).to.have.property('level',  'info');
		expect(events[2]).to.have.property('message');
		expect(events[2].message).to.be.eql(['info message', 1, false, {}]);

		expect(events[3]).to.have.property('callee', log.warn);
		expect(events[3]).to.have.property('module', module);
		expect(events[3]).to.have.property('level',  'warn');
		expect(events[3]).to.have.property('message');
		expect(events[3].message).to.be.eql(['warn message', 1, false, {}]);

		expect(events[4]).to.have.property('callee', log.error);
		expect(events[4]).to.have.property('module', module);
		expect(events[4]).to.have.property('level',  'error');
		expect(events[4]).to.have.property('message');
		expect(events[4].message).to.be.eql(['error message', 1, false, {}]);
	});
});
