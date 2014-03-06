'use strict';

module.exports = function redirector(/* options */) {
	var poison = require('poison');

	var Event = require('unilog').Event;
	var Levels = require('unilog').Levels;
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

		var newDebug = function unilogDebug(groupId) {
			var groupedLog = log.withGroupId(String(groupId).replace(':', '.'));

			var debugInstance = function unilogDebugLogger() {
				groupedLog.putEvent(new Event({
					callee:  unilogDebugLogger,
					level:   Levels.DEBUG,
					message: util.format.apply(util, arguments),
				}));
			};
			debugInstance.raw = debug(groupId);

			return debugInstance;
		};
		newDebug.raw = debug;
		debugModule.exports = newDebug;
	}
};
