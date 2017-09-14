/*
  Informative comments provided by https://www.blackhat.com/docs/us-17/thursday/us-17-Carettoni-Electronegativity-A-Study-Of-Electron-Security-wp.pdf
*/

const {app, BrowserWindow} = require('electron');
const path = require('path');

let win
app.on('ready', () => {
  win = new BrowserWindow({
    webPreferences: {
      /*
        nodeIntegration is disabled, JavaScriptis unable to leverage Node.js primitives and modules.
      */
      nodeIntegration: false,
      
      /*
         A sandboxed renderer does not have a Node.js environment running (with the  exception  of  preload  scripts)  
         and  the  renderers  can  only  make  changes  to  the system by delegating tasks to the main process via IPC. 
      */
      sandbox: true,
      
      /*
      contextIsolation introduces JavaScript context isolation for preload scripts, as implemented  in 
      Chrome Content Scripts.  This option should be used when loading potentially untrusted resources  
      to ensure that the  loaded content cannot tamper with the preload script and any Electron  
      APIs being used. The preload script will still have access to global variables, but it  
      will use its own set of JavaScript   builtins (Array, Object, JSON, etc.) and will be isolated 
      from any changes  made to the global environment by the loaded page. 
      */
      contextIsolation: true,
      
      /*
        The preload script binds a specific function to the window. The function has the ability to
        execute IPC messages without giving untrusted content complete access to ipcRenderer.
      */
      preload: path.join(__dirname, 'preload-extended.js')
    }
  })
  win.loadURL('file://' + __dirname + '/index.html')
})

console.log("Main initialized");


// In main process.
const ipcMain = require('electron').ipcMain;

ipcMain.on('rpc-start', function(event, rpc, arg) {
  console.log("other-value: " + rpc + " " + arg); 
  event.returnValue = 
  `
  { 
   "status": "started rpc succesfully"
  }
  `;
});


ipcMain.on('rpc-request', function(event, rpc, arg) {
  console.log("RPC REQUEST: " + rpc + " " + arg); 
  event.returnValue = 
  `
  { 
   "address": "pUYofdfsgasdpsdpfsaddressrofl"
  }
  `;
});
