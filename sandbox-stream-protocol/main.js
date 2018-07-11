/*
  main.js: the browser/main process
  Informative comments provided by https://www.blackhat.com/docs/us-17/thursday/us-17-Carettoni-Electronegativity-A-Study-Of-Electron-Security-wp.pdf
*/

const {app, BrowserWindow, protocol} = require('electron');
const path = require('path');
const fs = require('fs');
const stream = require('stream'); 

function getStream () {
  const rv = new stream.PassThrough() // PassThrough is also a Readable stream
  rv.push(`{"test":"yay"}`)
  rv.push(null)
  return rv
}

let win
app.on('ready', () => {
  win = new BrowserWindow({
    webPreferences: {
      /*
        nodeIntegration is disabled, JavaScript is unable to leverage Node.js primitives and modules.
        Note: sandbox:true should disable this by default, but we do it anyways.
      */
      // nodeIntegration: false,
      
      /*
         A sandboxed renderer does not have a Node.js environment running (with the  exception  of  preload  scripts)  
         and  the  renderers  can  only  make  changes  to  the system by delegating tasks to the main process via IPC. 
      */
      // sandbox: true,
      
      /*
      contextIsolation introduces JavaScript context isolation for preload scripts, as implemented  in 
      Chrome Content Scripts.  This option should be used when loading potentially untrusted resources  
      to ensure that the  loaded content cannot tamper with the preload script and any Electron  
      APIs being used. The preload script will still have access to global variables, but it  
      will use its own set of JavaScript   builtins (Array, Object, JSON, etc.) and will be isolated 
      from any changes  made to the global environment by the loaded page. 
      */
      // contextIsolation: true,
    }
  })
  win.loadURL('file://' + __dirname + '/index.html')


  /**
   * Register the "buffer" protocol.
   */
  protocol.registerBufferProtocol('buffer', function(request, callback) {
    callback({mimeType: 'text/html', data: new Buffer('<h5>Response</h5>')});
  }, function (error) {
    if (error)
      console.error('Failed to register protocol')
  });

  /**
   * Register the "stream" protocol and reply with a stream.
   */
  protocol.registerStreamProtocol('stream', (request, callback) => {
    console.log('url:', request.url)
      callback(getStream()
      )
    
  }, (error) => {
    if (error) console.error('Failed to register protocol')
  })

  /**
  * Intercept "http" with interceptStreamProtocol.
  */
  protocol.interceptStreamProtocol('http', (request, callback) => {
    console.log('url:', request.url)
      callback(getStream())
    
  }, (error) => {
    if (error) console.error('Failed to register protocol')
  })
})

console.log("Main initialized");


