'use strict';

module.exports = function redirector(/* options */) {
	var log = require('unilog');
	var util = require('util');

	redirect('error', 'error');
	redirect('info',  'info');
	redirect('log',   'info');
	redirect('warn',  'warn');


	function redirect(methodName, level) {
		var originalMethod = console[methodName];

		var newMethod = function override() {
			log.putEvent({
				callee:  override,
				level:   level,
				message: util.format.apply(util, arguments),
			});
		};
		newMethod.raw = originalMethod.bind(console);

		console[methodName] = newMethod;
	}
};
