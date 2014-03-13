'use strict';

var File = require('fs');
var Path = require('path');


module.exports = function unilogNexus(options) {
	options = options || {};

	var redirectors = File.readdirSync(Path.join(__dirname, 'redirectors'));
	redirectors.forEach(function(fileName) {
		if (!fileName.endsWith('.js')) {
			return;
		}

		var id = Path.basename(fileName).replace(/\.[^.]*$/, '');
		if (options.hasOwnProperty(id) && !options[id]) {
			// redirector disabled
			return;
		}

		require('./redirectors/' + id)(options[id] || {});
	});
};
