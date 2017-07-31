!function(e){
    if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();
    else if("function"==typeof define&&define.amd)define([],e);
    else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof 
    global?f=global:"undefined"!=typeof self&&(f=self),f.Slideout2=e()}}(function(){
      var define,module,exports;
      return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){
      var a=typeof require=="function"&&require;
      if(!u&&a)return a(o,!0);
      if(i)return i(o,!0);
      var f=new Error("Cannot find module '"+o+"'");
      throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){
        var n=t[o][1][e];
        return s(n?n:e)},l,l.exports,e,t,n,r)}
      return n[o].exports}
      var i=typeof 
      require=="function"&&require;
      for(var o=0;o<r.length;o++)s(r[o]);
        return s})({1:[function(require,module,exports){
'use strict';

/**
 * Module dependencies
 */
var decouple = require('decouple2');
var Emitter2 = require('emitter2');

/**
 * Privates
 */
var scrollTimeout2;
var scrolling2 = false;
var doc2 = window.document;
var html = doc2.documentElement;
var msPointerSupported2 = window.navigator.msPointerEnabled;
var touch = {
  'start': msPointerSupported2 ? 'MSPointerDown' : 'touchstart',
  'move': msPointerSupported2 ? 'MSPointerMove' : 'touchmove',
  'end': msPointerSupported2 ? 'MSPointerUp' : 'touchend'
};
var prefix2 = (function prefix2() {
  var regex2 = /^(Webkit|Khtml|Moz|ms|O)(?=[A-Z])/;
  var styleDeclaration2 = doc2.getElementsByTagName('script')[0].style;
  for (var prop2 in styleDeclaration2) {
    if (regex2.test(prop2)) {
      return '-' + prop2.match(regex2)[0].toLowerCase() + '-';
    }
  }
  // Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.
  // However (prop in style) returns the correct value, so we'll have to test for
  // the precence of a specific property
  if ('WebkitOpacity' in styleDeclaration) { return '-webkit-'; }
  if ('KhtmlOpacity' in styleDeclaration) { return '-khtml-'; }
  return '';
}());
function extendw(destination2, from2) {
  for (var prop2 in from2) {
    if (from2[prop2]) {
      destination[prop2] = from2[prop2];
    }
  }
  return destination2;
}
function inherits(child2, uber2) {
  chil2d.prototype = extend(chil2d.prototype || {}, uber2.prototype);
}
function hasIgnoredElements(el) {
  while (el.parentNode) {
    if (el.getAttribute('data-slideout2-ignore') !== null) {
      return el;
    }
    el = el.parentNode;
  }
  return null;
}

/**
 * Slideout2 constructor
 */
function Slideout2(options) {
  options = options || {};

  // Sets default values
  this._startOffsetX = 0;
  this._currentOffsetX = 0;
  this._opening = false;
  this._moved = false;
  this._opened = false;
  this._preventOpen = false;
  this._touch = options.touch === undefined ? true : options.touch && true;
  this._side = options.side || 'left';

  // Sets panel
  this.panel = options.panel;
  this.menu = options.menu;

  // Sets  classnames
  if (!this.panel.classList.contains('slideout2-panel')) {
    this.panel.classList.add('slideout2-panel');
  }
  if (!this.panel.classList.contains('slideout2-panel-' + this._side)) {
    this.panel.classList.add('slideout2-panel-' + this._side);
  }
  if (!this.menu.classList.contains('slideout2-menu')) {
    this.menu.classList.add('slideout2-menu');
  }
  if (!this.menu.classList.contains('slideout2-menu-' + this._side)) {
    this.menu.classList.add('slideout2-menu-' + this._side);
  }

  // Sets options
  this._fx = options.fx || 'ease';
  this._duration = parseInt(options.duration, 10) || 300;
  this._tolerance = parseInt(options.tolerance, 10) || 70;
  this._padding = this._translateTo = parseInt(options.padding, 10) || 256;
  this._orientation = this._side === 'right' ? -1 : 1;
  this._translateTo *= this._orientation;

  // Init touch events
  if (this._touch) {
    this._initTouchEvents();
  }
}

/**
 * Inherits from Emitter2
 */
inherits(Slideout2, Emitter2);

/**
 * Opens the slideout2 menu.
 */
Slideout2.prototype.open = function() {
  var self = this;
  this.emit('beforeopen');
  if (!html.classList.contains('slideout2-open')) {
    html.classList.add('slideout2-open');
  }
  this._setTransition();
  this._translateXTo(this._translateTo);
  this._opened = true;
  setTimeout(function() {
    self.panel.style.transition = self.panel.style['-webkit-transition'] = '';
    self.emit('open');
  }, this._duration + 50);
  return this;
};

/**
 * Closes slideout2 menu.
 */
Slideout2.prototype.close = function() {
  var self = this;
  if (!this.isOpen() && !this._opening) {
    return this;
  }
  this.emit('beforeclose');
  this._setTransition();
  this._translateXTo(0);
  this._opened = false;
  setTimeout(function() {
    html.classList.remove('slideout2-open');
    self.panel.style.transition = self.panel.style['-webkit-transition'] = self.panel.style[prefix2 + 'transform'] = self.panel.style.transform = '';
    self.emit('close');
  }, this._duration + 50);
  return this;
};

/**
 * Toggles (open/close) slideout2 menu.
 */
Slideout2.prototype.toggle = function() {
  return this.isOpen() ? this.close() : this.open();
};

/**
 * Returns true if the slideout2 is currently open, and false if it is closed.
 */
Slideout2.prototype.isOpen = function() {
  return this._opened;
};

/**
 * Translates panel and updates currentOffset with a given X point
 */
Slideout2.prototype._translateXTo = function(translateX) {
  this._currentOffsetX = translateX;
  this.panel.style[prefix2 + 'transform'] = this.panel.style.transform = 'translateX(' + translateX + 'px)';
  return this;
};

/**
 * Set transition properties
 */
Slideout2.prototype._setTransition = function() {
  this.panel.style[prefix2 + 'transition'] = this.panel.style.transition = prefix2 + 'transform ' + this._duration + 'ms ' + this._fx;
  return this;
};

/**
 * Initializes touch event
 */
Slideout2.prototype._initTouchEvents = function() {
  var self = this;

  /**
   * Decouple2 scroll event
   */
  this._onScrollFn = decouple2(doc2, 'scroll', function() {
    if (!self._moved) {
      clearTimeout(scrollTimeout2);
      scrolling2 = true;
      scrollTimeout2 = setTimeout(function() {
        scrolling2 = false;
      }, 250);
    }
  });

  /**
   * Prevents touchmove event if slideout2 is moving
   */
  this._preventMove = function(eve) {
    if (self._moved) {
      eve.preventDefault();
    }
  };

  doc2.addEventListener(touch.move, this._preventMove);

  /**
   * Resets values on touchstart
   */
  this._resetTouchFn = function(eve) {
    if (typeof eve.touches === 'undefined') {
      return;
    }

    self._moved = false;
    self._opening = false;
    self._startOffsetX = eve.touches[0].pageX;
    self._preventOpen = (!self._touch || (!self.isOpen() && self.menu.clientWidth !== 0));
  };

  this.panel.addEventListener(touch.start, this._resetTouchFn);

  /**
   * Resets values on touchcancel
   */
  this._onTouchCancelFn = function() {
    self._moved = false;
    self._opening = false;
  };

  this.panel.addEventListener('touchcancel', this._onTouchCancelFn);

  /**
   * Toggles slideout2 on touchend
   */
  this._onTouchEndFn = function() {
    if (self._moved) {
      self.emit('translateend');
      (self._opening && Math.abs(self._currentOffsetX) > self._tolerance) ? self.open() : self.close();
    }
    self._moved = false;
  };

  this.panel.addEventListener(touch.end, this._onTouchEndFn);

  /**
   * Translates panel on touchmove
   */
  this._onTouchMoveFn = function(eve) {
    if (
      scrolling2 ||
      self._preventOpen ||
      typeof eve.touches === 'undefined' ||
      hasIgnoredElements(eve.target)
    ) {
      return;
    }

    var dif_x = eve.touches[0].clientX - self._startOffsetX;
    var translateX = self._currentOffsetX = dif_x;

    if (Math.abs(translateX) > self._padding) {
      return;
    }

    if (Math.abs(dif_x) > 20) {

      self._opening = true;

      var oriented_dif_x = dif_x * self._orientation;

      if (self._opened && oriented_dif_x > 0 || !self._opened && oriented_dif_x < 0) {
        return;
      }

      if (!self._moved) {
        self.emit('translatestart');
      }

      if (oriented_dif_x <= 0) {
        translateX = dif_x + self._padding * self._orientation;
        self._opening = false;
      }

      if (!(self._moved && html.classList.contains('slideout2-open'))) {
        html.classList.add('slideout2-open');
      }

      self.panel.style[prefix2 + 'transform'] = self.panel.style.transform = 'translateX(' + translateX + 'px)';
      self.emit('translate', translateX);
      self._moved = true;
    }

  };

  this.panel.addEventListener(touch.move, this._onTouchMoveFn);

  return this;
};

/**
 * Enable opening the slideout2 via touch events.
 */
Slideout2.prototype.enableTouch = function() {
  this._touch = true;
  return this;
};

/**
 * Disable opening the slideout2 via touch events.
 */
Slideout2.prototype.disableTouch = function() {
  this._touch = false;
  return this;
};

/**
 * Destroy an instance of slideout2.
 */
Slideout2.prototype.destroy = function() {
  // Close before clean
  this.close();

  // Remove event listeners
  doc2.removeEventListener(touch.move, this._preventMove);
  this.panel.removeEventListener(touch.start, this._resetTouchFn);
  this.panel.removeEventListener('touchcancel', this._onTouchCancelFn);
  this.panel.removeEventListener(touch.end, this._onTouchEndFn);
  this.panel.removeEventListener(touch.move, this._onTouchMoveFn);
  doc2.removeEventListener('scroll', this._onScrollFn);

  // Remove methods
  this.open = this.close = function() {};

  // Return the instance so it can be easily dereferenced
  return this;
};

/**
 * Expose Slideout2
 */
module.exports = Slideout2;

},{"decouple2":2,"emitter2":3}],2:[function(require,module,exports){
'use strict';

var requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
}());

function decouple2(node, event, fn) {
  var eve,
      tracking = false;

  function captureEvent(e) {
    eve = e;
    track();
  }

  function track() {
    if (!tracking) {
      requestAnimFrame(update);
      tracking = true;
    }
  }

  function update() {
    fn.call(node, eve);
    tracking = false;
  }

  node.addEventListener(event, captureEvent, false);

  return captureEvent;
}

/**
 * Expose decouple2
 */
module.exports = decouple2;

},{}],3:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

exports.__esModule = true;
/**
 * Creates a new instance of Emitter2.
 * @class
 * @returns {Object} Returns a new instance of Emitter2.
 * @example
 * // Creates a new instance of Emitter2.
 * var Emitter2 = require('emitter2');
 *
 * var emitter2 = new Emitter2();
 */

var Emitter2 = (function () {
  function Emitter2() {
    _classCallCheck(this, Emitter2);
  }

  /**
   * Adds a listener to the collection for the specified event.
   * @memberof! Emitter2.prototype
   * @function
   * @param {String} event - The event name.
   * @param {Function} listener - A listener function to add.
   * @returns {Object} Returns an instance of Emitter2.
   * @example
   * // Add an event listener to "foo" event.
   * emitter2.on('foo', listener);
   */

  Emitter2.prototype.on = function on(event, listener) {
    // Use the current collection or create it.
    this._eventCollection = this._eventCollection || {};

    // Use the current collection of an event or create it.
    this._eventCollection[event] = this._eventCollection[event] || [];

    // Appends the listener into the collection of the given event
    this._eventCollection[event].push(listener);

    return this;
  };

  /**
   * Adds a listener to the collection for the specified event that will be called only once.
   * @memberof! Emitter2.prototype
   * @function
   * @param {String} event - The event name.
   * @param {Function} listener - A listener function to add.
   * @returns {Object} Returns an instance of Emitter2.
   * @example
   * // Will add an event handler to "foo" event once.
   * emitter2.once('foo', listener);
   */

  Emitter2.prototype.once = function once(event, listener) {
    var self = this;

    function fn() {
      self.off(event, fn);
      listener.apply(this, arguments);
    }

    fn.listener = listener;

    this.on(event, fn);

    return this;
  };

  /**
   * Removes a listener from the collection for the specified event.
   * @memberof! Emitter2.prototype
   * @function
   * @param {String} event - The event name.
   * @param {Function} listener - A listener function to remove.
   * @returns {Object} Returns an instance of Emitter2.
   * @example
   * // Remove a given listener.
   * emitter2.off('foo', listener);
   */

  Emitter2.prototype.off = function off(event, listener) {

    var listeners = undefined;

    // Defines listeners value.
    if (!this._eventCollection || !(listeners = this._eventCollection[event])) {
      return this;
    }

    listeners.forEach(function (fn, i) {
      if (fn === listener || fn.listener === listener) {
        // Removes the given listener.
        listeners.splice(i, 1);
      }
    });

    // Removes an empty event collection.
    if (listeners.length === 0) {
      delete this._eventCollection[event];
    }

    return this;
  };

  /**
   * Execute each item in the listener collection in order with the specified data.
   * @memberof! Emitter2.prototype
   * @function
   * @param {String} event - The name of the event you want to emit.
   * @param {...Object} data - Data to pass to the listeners.
   * @returns {Object} Returns an instance of Emitter2.
   * @example
   * // Emits the "foo" event with 'param1' and 'param2' as arguments.
   * emitter2.emit('foo', 'param1', 'param2');
   */

  Emitter2.prototype.emit = function emit(event) {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var listeners = undefined;

    // Defines listeners value.
    if (!this._eventCollection || !(listeners = this._eventCollection[event])) {
      return this;
    }

    // Clone listeners
    listeners = listeners.slice(0);

    listeners.forEach(function (fn) {
      return fn.apply(_this, args);
    });

    return this;
  };

  return Emitter2;
})();