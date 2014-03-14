'use strict';

module.exports = function redirector(/* options */) {
	var Poison = require('poison');

	var log = require('unilog');


	Poison.getModulesByName('nlogger').forEach(redirect);
	Poison.addHook('nlogger', function(moduleName, mod) {
		redirect(mod);
	});


	function redirect(nloggerModule) {
		var nlogger = nloggerModule.exports;
		if (!nlogger || typeof nlogger.logger !== 'function') {
			return;
		}

		function unilogNexus_logger(mod) {
			return log.withModule(mod);
		}
		unilogNexus_logger.raw = nlogger.logger.bind(nlogger);

		nlogger.logger = unilogNexus_logger;
	}
};
