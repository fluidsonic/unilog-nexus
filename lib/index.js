'use strict';

require('poison');

var File = require('fs');
var Path = require('path');

var _loadedRedirectors = {};


module.exports = function unilogNexus(options) {
	options = options || {};

	var redirectors = File.readdirSync(Path.join(__dirname, 'redirectors'));
	redirectors.forEach(function(fileName) {
		if (!fileName.match(/\.js$/)) {
			return;
		}

		var id = Path.basename(fileName).replace(/\.[^.]*$/, '');
		if (_loadedRedirectors[id]) {
			return;
		}

		if (options.hasOwnProperty(id) && !options[id]) {
			// redirector disabled
			return;
		}

		_loadedRedirectors[id] = true;

		require('./redirectors/' + id)(options[id] || {});
	});
};
