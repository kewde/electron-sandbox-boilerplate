/*
  Informative comments provided by https://www.blackhat.com/docs/us-17/thursday/us-17-Carettoni-Electronegativity-A-Study-Of-Electron-Security-wp.pdf
*/

const {app, BrowserWindow} = require('electron');
const path = require('path');

let win
app.on('ready', () => {
  win = new BrowserWindow({
    webPreferences: {
      contextIsolation: true,
    }
  })
  win.loadURL('chrome://brave/' + __dirname + '/renderer/index.html')

})

console.log("Main initialized");


// In main process.
const ipcMain = require('electron').ipcMain;

ipcMain.on('rpc', (event, rpc, arg) => {
  console.log("[RPC] " + rpc + " " + arg);
  event.sender.send('thanks');
});



