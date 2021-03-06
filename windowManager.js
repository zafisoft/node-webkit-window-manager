var $ = require("jquery");
var _ = require("underscore");


/**
 * A reference to all potentially managed windows, open or closed.
 */
var windows = {
	"index": {
		page:"html/index.html",
		options: {
			frame: true,
			toolbar: true,
			width: 900,
			height: 700,
			show: true
		}
	}
};


/**
 * Instantiate a windowManager object. Note that require('nw.gui') cannot be called inside a Node.js
 * module, but it can be passed into the module and stored as a reference. If _windows argument is
 * ommitted, this module defaults to managing only the index page located at html/index.html.
 *
 * @param {nw.gui} gui This is the require('nw.gui') object. 
 * @param {Object} _windows Optional collection of windows to load into the module to be managed.
 */
function WindowManager(gui, _windows) {
	windows = _windows || windows;
	this.gui = gui;
	this.openWindows = new Array();
}


/**
 * Open the managed window identified by "name". 
 *
 * @param {String} name The name of the window to open, identified by the key in the windows object.
 * @param {Object} data A collection of data to pass from the calling window or module to the target window.
 * @return {Object} Returns a reference to the opened window.
 */
WindowManager.prototype.open = function(name, data) {
	var _self = this;
	var windowRef = _self.gui.Window.open(windows[name].page,windows[name].options);
	windowRef.on('close',function(){
		this.hide();
		_self.openWindows = _.without(_self.openWindows,windowRef);
		this.close(true);
		this.closed = true;
		_self.openWindows = _self.openWindows.filter(function(element) {
		  return element.closed === undefined;
		});
	});
	windowRef.on('load',function() {
		windowRef.window.console.warn("MESSAGES AFDAFDAS FDAS F");
	});
	windowRef.name = name;
	windowRef.data = data;
	_self.openWindows.push(windowRef);
	return windowRef;
}


/**
 * Close the window identified by "name".
 * 
 * @param {String} name The name of a window to close, identified by the key in the windows object.
 * @return {Object} Returns a reference to the closed window.
 */
WindowManager.prototype.close = function(name) {
	var _self = this;
	var windowRef = _.where(_self.openWindows, {name: name});
	if(windowRef === undefined || windowRef.length == 0) throw new Error('The window "' + name + '"" is not open, or an unknown error has occurred.');
	windowRef[0].close();
	return windowRef;
}


/**
 * Get a reference to the opened window, identified by "name".
 *
 * @param {String} name The name of a window reference to retrieve, identified by the key in the windows object.
 * @return {Object} Returns a reference to the open window.
 */
WindowManager.prototype.get = function(name) {
	var _self = this;
	var windowRef = _.where(_self.openWindows, {name: name});
	if(windowRef === undefined || windowRef.length == 0) throw new Error('The window "' + name + '"" is not open, or an unknown error has occurred.');
	return windowRef[0];
}

exports.windowManager = WindowManager;