// This file is loaded whenever a javascript context is created. It runs in a
// private scope that can access a subset of electron renderer APIs. We must be
// careful to not leak any objects into the global scope!
const {ipcRenderer} = require('electron')

console.log('preload init');

function sendIPCMessage (rpc, arg) {
  return ipcRenderer.sendSync('rpc-request', rpc, arg);
}
  /*
    For security reasons, you can not allow custom channels. You MUST use static predefined channels
    for communications between the renderer and the main process. There are certain IPC channel that
    you can use to perform malicious acts.
    
    VULNERABLE example:
    function sendMessage(channel, arg) {
      return ipcRenderer.sendSync(channel, arg);
    }
    
    The above example is vulnerable.
    app = window.sendMessage('ELECTRON_BROWSER_GET_BUILTIN', 'app');
    The code above exploits the vulnerable sendMessage function in such a way that it
    returns the handle to app, causing a privilege escalation.
    
    Lesson: use HARDCODED CHANNELS.  
  */

// we want to allow our untrusted content to send messages to the main process, so we bind it to the window scope.
window.sendMessage = sendIPCMessage

