'use strict';

module.exports = function redirector(/* options */) {
	var Event = require('unilog').Event;
	var Levels = require('unilog').Levels;
	var log = require('unilog');
	var util = require('util');


	redirect('error', Levels.ERROR);
	redirect('info',  Levels.INFO);
	redirect('log',   Levels.INFO);
	redirect('warn',  Levels.WARN);


	function redirect(methodName, level) {
		var originalMethod = console[methodName];

		var newMethod = function override() {
			log.putEvent(new Event({
				callee:  override,
				level:   level,
				message: util.format.apply(util, arguments),
			}));
		};
		newMethod.raw = originalMethod.bind(console);

		console[methodName] = newMethod;
	}
};
