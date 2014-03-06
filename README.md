unilog-nexus
============

Aggregates [debug](https://github.com/visionmedia/debug), [nlogger](https://github.com/igo/nlogger) and
[console](http://nodejs.org/api/stdio.html) output into the [unilog](https://github.com/fluidsonic/unilog) node.js module.

node.js projects rely on plenty of modules and many of them use distinct logging facilities.
Having a unified log output is difficult and configuring the log output is even worse.

[unilog](https://github.com/fluidsonic/unilog) aims to unify logging and *unilog-nexus* allows you to redirect the log output of some well-known logging modules into unilog.

**It's just a single line of code!**



Quickstart
----------

Put this code at the very beginning of your node.js project to ensure that all other logging libraries are correctly hooked.

```javascript
require('unilog-nexus')();
```


Configuration
-------------

You can disable specific redirectors if you want to.

```javascript
require('unilog-nexus')({
	console: false,
	debug:   false,
	nlogger: false,
});
```


Mapping
-------

This section roughly describes the mapping between the redirected module and unilog.

### console

- No group id will be provided to unilog.
- `console.error()` ▸ `unilog.error()`
- `console.info()` ▸ `unilog.info()`
- `console.log()` ▸ `unilog.info()`
- `console.warn()` ▸ `unilog.warn()`

### debug

- `require('debug')('a:b:c')` ▸ `require('unilog').withGroupId('a.b.c')`
- `debug()` ▸ `unilog.debug()`

### nlogger

- `require('nlogger').logger(module)` ▸ `require('unilog').withModule(module)`
- `nlogger.debug()` ▸ `unilog.debug()`
- `nlogger.error()` ▸ `unilog.error()`
- `nlogger.info()` ▸ `unilog.info()`
- `nlogger.trace()` ▸ `unilog.trace()`
- `nlogger.warn()` ▸ `unilog.warn()`



Accessing Raw Facilities
------------------------

The original implementations aren't lost! Just in case you need them for some quick debugging.

### console

- `console.error()` ▸ `console.log.raw()`
- `console.info()` ▸ `console.info.raw()`
- `console.log()` ▸ `console.log.raw()`
- `console.warn()` ▸ `console.warn.raw()`

### debug

- `require('debug')('xyz')` ▸ `require('debug').raw('xyz')` or
- `debug('log message')` ▸ `debug.raw('log message')`

### nlogger

- `require('nlogger').logger(module)` ▸ `require('nlogger').raw(module)`



Installation
------------

	$ npm install unilog-nexus



Contribute!
-----------

Support this project by providing redirector implementations for even more node.js logging modules.



To-Do
-----

- allow configuration of redirectors
- implement more redirectors
- add tests



License
-------

MIT