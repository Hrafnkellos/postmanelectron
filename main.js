// Modules to control application life and create native browser window
const ncp = require('ncp').ncp;
const fs = require('fs');
const os = require('os');
const {app, BrowserWindow, ipcMain} = require('electron')

const source = `C:\\Users\\${os.userInfo().username}\\AppData\\Roaming\\Postman\\IndexedDB`;
const destination = `C:\\Users\\${os.userInfo().username}\\AppData\\Roaming\\postmanelectron\\IndexedDB`;
let appReady = false;
let copyReady = false;
ncp.limit = 16;

function copyFiles() {
  ncp(source, destination, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('done!');
    copyReady = true;
    createWindow();
  });
}

copyFiles();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  if(!appReady || !copyReady)
    return;
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, show:true})
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  appReady = true;
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.sender.send('asynchronous-reply', 'pong')
});

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})

function writeFile(data) {
  fs.writeFile("./postmandata.json", data, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  });   
}


ipcMain.on('postmandump', (event, arg) => {
  
  writeFile(arg);
  event.returnValue = 'pong'
})
