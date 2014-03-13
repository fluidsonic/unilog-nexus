'use strict';

// we need each test file to run in a new process because unilog-nexus can only be set up once

// you can add additional mocha options: node test\helpers\runner --grep "console"

var ChildProcess = require('child_process');
var File = require('fs');
var Path = require('path');
var rimraf = require('rimraf');

var projectPath = Path.join(__dirname, '..', '..');
var childCoveragePath = Path.join(projectPath, 'coverage/child');
var istanbulPath = Path.join(projectPath, 'node_modules/istanbul/lib/cli');
var mochaPath = Path.join(projectPath, 'node_modules/mocha');
var mochaBinaryPath = Path.join(mochaPath, 'bin/_mocha');
var mochaDebugPath = Path.join(projectPath, 'node_modules/mocha/node_modules/debug');
var testPath = Path.join(projectPath, 'test');

if (!File.existsSync(mochaDebugPath)) {
	console.log('mocha must use its own debug module so we can properly test our debug-hooks');
	var child = ChildProcess.spawn((process.platform.match(/^win/) ? 'npm.cmd' : 'npm'), [ 'install', 'debug@0.6.0' ], {
		cwd:   mochaPath,
		stdio: 'inherit',
	});
	child.on('error', function(error) {
		throw error;
	});
	child.on('exit', function(code) {
		if (code !== 0) {
			throw new Error('installing debug into mocha failed with code ' + code);
		}

		start();
	});
}
else {
	start();
}


function start() {
	runTestFiles(findTestFiles(testPath), function(error, exitCode) {
		if (error) {
			return finish(error);
		}

		createFileReport(exitCode, finish);
	});
}


function finish(error, exitCode) {
	rimraf(childCoveragePath, function() {
		if (error) {
			throw error;
		}

		process.exit(exitCode);
	});
}


function createFileReport(exitCode, done) {
	var args = [istanbulPath, 'report', 'lcov', '--root', childCoveragePath];

	// console.log('> (spawn) \'' + process.execPath + '\' \'' + args.join('\' \'') + '\'');
	var child = ChildProcess.spawn('node', args, {
		stdio: 'inherit',
	});
	child.on('error', done);
	child.on('exit', function(code) {
		if (code !== 0 && !exitCode) {
			exitCode = code || 1;
		}

		createTextReport(exitCode, done);
	});
}


function createTextReport(exitCode, done) {
	var args = [istanbulPath, 'report', 'text-summary', '--root', childCoveragePath];

	// console.log('> (spawn) \'' + process.execPath + '\' \'' + args.join('\' \'') + '\'');
	var child = ChildProcess.spawn(process.execPath, args, {
		stdio: 'inherit',
	});
	child.on('error', done);
	child.on('exit', function(code) {
		if (code !== 0 && !exitCode) {
			exitCode = code || 1;
		}

		done(null, exitCode);
	});
}


function findTestFiles(path) {
	var files = [];
	File.readdirSync(path).forEach(function(file) {
		if (file === 'helpers') {
			return;
		}

		var filePath = Path.join(path, file);
		var stat = File.lstatSync(filePath);
		if (stat.isDirectory()) {
			files = files.concat(findTestFiles(filePath));
		}
		else if (stat.isFile() && filePath.match(/\.js$/)) {
			files.push(filePath);
		}
	});

	return files;
}


function runTestFiles(testFiles, done) {
	var exitCode = 0;
	var testNumber = 0;

	runNextTestFile();

	function runNextTestFile() {
		var testFile = testFiles.shift();
		if (!testFile) {
			return done(null, exitCode);
		}

		++testNumber;

		var args = [
			istanbulPath,
			'cover',
			'--dir', Path.join(childCoveragePath, String(testNumber)),
			'--root', projectPath,
			'--print', 'none',
			'--report', 'none',
			mochaBinaryPath,
			'--',
			'--reporter', 'spec'];

		args = args.concat(process.argv.slice(2));
		args.push(testFile);

		// console.log('> (spawn) \'' + process.execPath + '\' \'' + args.join('\' \'') + '\'');
		var child = ChildProcess.spawn(process.execPath, args, {
			stdio: 'inherit',
		});
		child.on('error', done);
		child.on('exit', function(code) {
			if (code !== 0 && !exitCode) {
				exitCode = code || 1;
			}

			runNextTestFile();
		});
	}
}
