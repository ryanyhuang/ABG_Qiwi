# grunt-connect-socket.io v0.7.1 [![Build Status](https://travis-ci.org/fardog/grunt-connect-socket.io.png?branch=feature-socket.io)](https://travis-ci.org/fardog/grunt-connect-socket.io)

> Start a connect web server, optionally with socket.io enabled.



## Getting Started
This plugin is a fork of Grunt's official [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect) with [Socket.IO](http://socket.io/) support added. This README only describes the Socket.IO additions; for all other options available you should consult the [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect) docs.

This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-contrib-connect --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-connect-socket.io');
```

## Connect task
_Run this task with the `grunt connect` command._

Note that this server only runs as long as grunt is running. Once grunt's tasks have completed, the web server stops. This behavior can be changed with the [keepalive](#keepalive) option, and can be enabled ad-hoc by running the task like `grunt connect:keepalive`.

### Options

#### socketio
Type: `Boolean`  
Default: `false`

Determines if Socket.IO should be loaded.

### Usage examples

#### Basic Use
In this example, `grunt connect` (or more verbosely, `grunt connect:server`) will start a static web server at `http://localhost:9001/`, with its base path set to the `www-root` directory relative to the gruntfile, and any tasks run afterwards will be able to access it. Socket.IO is enabled.

```javascript
// Project configuration.
grunt.initConfig({
  connect: {
    server: {
      options: {
        port: 9001,
        base: 'www-root',
        socketio: true
      }
    }
  }
});
```

Once the connect and Socket.IO servers are running, a grunt event will be emitted as `connect.{taskName}.socketio.listening` and the config option gets a copy of the listening Socket.IO object at `{configBase}.connect.{taskName}.socketio`.

Now you can use Socket.IO elsewhere, e.g.:

```javascript
var grunt = require('grunt');
var config = grunt.config.data.connect.use_socket_io;
var socketio = config.socketio;

socketio.sockets.on('connection', function(socket) {
    socket.emit('test', {message: "Hello!"});
});
```

## Release History

 * 2014-02-27   v0.7.1   Fixes issue with the '*' hostname option.
 * 2014-02-18   v0.7.0   Update connect to ~2.13.0. Default hostname switched to '0.0.0.0'. Modified options.middleware to accept an array or a function.
 * 2013-12-29   v0.6.0   Open options.hostname if provided. Update connect-livereload to ~0.3.0. Update connect to ~2.12.0. Use well-formed ssl certificates. Support all options of open. Make directory browseable when base is a string.
 * 2013-09-05   v0.5.0   Add 'open' option.
 * 2013-09-05   v0.4.2   Un-normalize options.base as it should be a string or an array as the user has set. Fix setting target hostname option.
 * 2013-09-02   v0.4.1   Browse-able directory is the last item supplied to bases. Added directory option to override browse-able directory.
 * 2013-09-01   v0.4.0   Fix logging of which server address. Ability to set multiple bases. Event emitted when server starts listening. Support for HTTPS. debug option added to display debug logging like the --debug flag. livereload option added to inject a livereload snippet into the page.
 * 2013-04-10   v0.3.0   Add ability to listen on system-assigned port.
 * 2013-03-07   v0.2.0   Upgrade connect dependency.
 * 2013-02-17   v0.1.2   Ensure Gruntfile.js is included on npm.
 * 2013-02-15   v0.1.1   First official release for Grunt 0.4.0.
 * 2013-01-18   v0.1.1rc6   Updating grunt/gruntplugin dependencies to rc6. Changing in-development grunt/gruntplugin dependency versions from tilde version ranges to specific versions.
 * 2013-01-09   v0.1.1rc5   Updating to work with grunt v0.4.0rc5.
 * 2012-11-01   v0.1.0   Work in progress, not yet officially released.

---

Task submitted by ["Cowboy" Ben Alman](http://benalman.com)

*This file was generated on Fri Feb 28 2014 22:38:50.*
