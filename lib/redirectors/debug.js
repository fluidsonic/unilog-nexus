'use strict';

module.exports = function redirector(/* options */) {
	var Poison = require('poison');

	var log = require('unilog');
	var Util = require('util');


	Poison.getModulesByName('debug').forEach(redirect);
	Poison.addHook('debug', function(moduleName, mod) {
		redirect(mod);
	});


	function redirect(debugModule) {
		var debug = debugModule.exports;
		if (typeof debug !== 'function') {
			return;
		}

		var newDebug = function unilogNexus_debug(groupId) {
			var groupedLog = log.withGroupId(String(groupId).replace(/:/g, '.'));

			var debugInstance = function unilogNexus_debugInstance() {
				groupedLog.putEvent({
					callee:  unilogNexus_debugInstance,
					level:   'debug',
					message: Util.format.apply(Util, arguments),
				});
			};
			debugInstance.raw = debug(groupId);

			return debugInstance;
		};
		newDebug.raw = debug;
		debugModule.exports = newDebug;
	}
};
