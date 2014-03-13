'use strict';

module.exports = function redirector(/* options */) {
	var poison = require('poison');

	var log = require('unilog');
	var util = require('util');


	poison.getModulesByName('debug').forEach(redirect);
	poison.addHook('debug', function(moduleName, mod) {
		redirect(mod);
	});


	function redirect(debugModule) {
		var debug = debugModule.exports;
		if (typeof debug !== 'function') {
			return;
		}

		var newDebug = function unilogNexus_debug(groupId) {
			var groupedLog = log.withGroupId(String(groupId).replace(':', '.'));

			var debugInstance = function unilogNexus_debugInstance() {
				groupedLog.putEvent({
					callee:  unilogNexus_debugInstance,
					level:   'debug',
					message: util.format.apply(util, arguments),
				});
			};
			debugInstance.raw = debug(groupId);

			return debugInstance;
		};
		newDebug.raw = debug;
		debugModule.exports = newDebug;
	}
};
