'use strict';

module.exports = function redirector(/* options */) {
	var poison = require('poison');

	var log = require('unilog');


	poison.getModulesByName('nlogger').forEach(redirect);
	poison.addHook('nlogger', function(moduleName, mod) {
		redirect(mod);
	});


	function redirect(nloggerModule) {
		var nlogger = nloggerModule.exports;
		if (!nlogger || typeof nlogger.logger !== 'function') {
			return;
		}

		function unilogLogger(mod) {
			return log.withModule(mod);
		}
		unilogLogger.raw = nlogger.logger.bind(nlogger);

		nlogger.logger = unilogLogger;
	}
};
