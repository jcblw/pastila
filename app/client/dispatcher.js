const
  EventEmitter = require('eventemitter2').EventEmitter2,
  ipc = require('ipc'),
  events = {
    'title:update': 'onTitleUpdate',
    'app:state': 'onAppState',
    'auth:start': 'onAuthStart',
    'auth:signout': 'IPCProxy',
    'gist:all': 'IPCProxy',
    'gist:get': 'IPCProxy',
    'gist:update': 'IPCProxy',
    'gist:del': 'IPCProxy',
    'gist:create': 'IPCProxy'
  },
  IPCEvents = {
    'app:initialState': 'setAppState',
    'auth:success': 'onAuthSuccess',
    'auth:signout': 'UIProxy',
    'auth:error': 'log',
    'gist:all': 'UIProxy',
    'gist:get': 'UIProxy',
    'ui:open': 'selfProxy',
    'ui:forcesave': 'selfProxy',
    'ui:new': 'selfProxy'
  };

class Dispatcher extends EventEmitter {
    constructor () {
      super();
    }
    // attaches event listeners
    start(query) {
      const UI = require('./ui');
      this.ui = new UI(query);
      this._bindEvents();
      this.ui.start();
      ipc.send('app:getInitialState');
    }

    _bindEvents() {
      // self events
      for(let eventName in events) {
        this._bindTo(this, eventName, events[eventName]);
      }
      // ipc events
      for(let eventName in IPCEvents) {
        this._bindTo(ipc, eventName, IPCEvents[eventName]);
      }
    }

    _bindTo(emitter, eventName, methodName) {
      let fn = this[methodName];
      if (typeof fn === 'function') {
        emitter.on(eventName, fn.bind(this));
      // dispatcher will proxy stuff alot
      } else if (methodName === 'IPCProxy') {
        emitter.on(eventName, ipc.send.bind(ipc, eventName));
      } else if (methodName === 'UIProxy') {
        emitter.on(eventName, this.ui.update.bind(this.ui, eventName));
      } else if (methodName === 'selfProxy') {
        emitter.on(eventName, this.emit.bind(this, eventName));
      }
    }

    onAuthStart() {
      this.ui.update('auth:start');
      ipc.send('auth:start');
    }

    onAuthSuccess(auth) {
      this.ui.update('auth:success', auth);
      this.emit('gist:all');
    }

    onTitleUpdate(str) {
      window.document.title = str;
    }

    onAppState(state) {
      ipc.send('app:state', state);
      window.onbeforeunload = null;
      setTimeout(window.close, 0);
    }

    setAppState(state) {
      this.ui.update('state', state);
    }
}

module.exports = new Dispatcher();
module.exports.Dispatcher = Dispatcher;
