'use strict';

require('poison');

var File = require('fs');
var Path = require('path');


module.exports = function unilogNexus(options) {
	options = options || {};

	var redirectors = File.readdirSync(Path.join(__dirname, 'redirectors'));
	redirectors.forEach(function(fileName) {
		if (!fileName.match(/\.js$/)) {
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

// TODO only run each redirector at most once
