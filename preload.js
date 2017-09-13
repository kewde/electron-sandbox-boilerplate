// This file is loaded whenever a javascript context is created. It runs in a
// private scope that can access a subset of electron renderer APIs. We must be
// careful to not leak any objects into the global scope!
const {ipcRenderer} = require('electron')

console.log('preload init');

function sendIPCMessage (rpc, arg) {
  return ipcRenderer.sendSync('rpc-request', rpc, arg);
}

window.sendMessage = sendIPCMessage

