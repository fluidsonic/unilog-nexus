'use strict';

var unilog = require('unilog');


module.exports = function capture(task, result) {
	var originalTarget = unilog.getGlobalTarget();
	var events = [];

	unilog.setGlobalTarget({
		eventEnabled: function eventEnabled() {
			return true;
		},

		putEvent: function putEvent(event) {
			events.push(event);
		},
	});

	try {
		task();
	}
	finally {
		unilog.setGlobalTarget(originalTarget);
	}

	result(events);
};
