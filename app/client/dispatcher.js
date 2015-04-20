var EventEmitter = require('eventemitter2').EventEmitter2;

// pretty bare bones right now
// should probably extend to push everything to ipc.
class Dispatcher extends EventEmitter {
    constructor () {
      super();
    }
}

module.exports = new Dispatcher();
module.exports.Dispatcher = Dispatcher;
