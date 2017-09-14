const {app, BrowserWindow} = require('electron');
const path = require('path');

let win
app.on('ready', () => {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      sandbox: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadURL('file://' + __dirname + '/index.html')
})

console.log("Main initialized");


// In main process.
const ipcMain = require('electron').ipcMain;

ipcMain.on('rpc-request', function(event, rpc, arg) {
  console.log("RPC REQUEST: " + rpc + " " + arg); 
  event.returnValue = 
  `
  { 
   "address": "pUYofdfsgasdpsdpfsaddressrofl"
  }
  `;
});
