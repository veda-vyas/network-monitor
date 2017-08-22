// Handle Squirrel events for Windows immediately on start
if(require('electron-squirrel-startup')) return;

const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const {autoUpdater} = electron;
const {ipcMain} = electron;
const os = require('os');

const logger = require('winston');
logger.level = 'debug';
global.logger = logger;

var mainWindow = null;

var updateFeed = 'http://localhost:8000/release';
var isDevelopment = process.env.NODE_ENV === 'development';
var feedURL = "";

if (os.platform() === 'darwin') {
    updateFeed = 'http://localhost:8000/updates/latest'; 
}
else if (os.platform() === 'win32') {
    updateFeed = 'http://localhost:8000/release/win' + (os.arch() === 'x64' ? '64/' : '32/');
}

autoUpdater.addListener("update-available", function(event) {
    logger.debug("A new update is available");
    if (mainWindow) {
        mainWindow.webContents.send('update-message', 'update-available. downloading-the-update...');
    }
});
autoUpdater.addListener("update-downloaded", function(event, releaseNotes, releaseName, releaseDate, updateURL) {
    logger.debug("A new update is ready to install", `Version ${releaseName} is downloaded and will be automatically installed on Quit`);
    if (mainWindow) {
        mainWindow.webContents.send('update-message', 'A new update is ready to install, Version '+releaseName+' is downloaded and will be automatically installed on Restart');
    }
});
autoUpdater.addListener("error", function(error) {
    logger.error(error);
    if (mainWindow) {
        mainWindow.webContents.send('update-message', error);
    }
});
autoUpdater.addListener("checking-for-update", function(event) {
    logger.debug("Checking for update");
    if (mainWindow) {
        mainWindow.webContents.send('update-message', 'checking-for-update');
    }
});
autoUpdater.addListener("update-not-available", function() {
    logger.debug("Update not available");
    if (mainWindow) {
        mainWindow.webContents.send('update-message', 'update-not-available');
    }
});

const appVersion = require('./package.json').version;
feedURL = updateFeed + '?v=' + appVersion;
autoUpdater.setFeedURL(feedURL);

// Quit when all windows are closed
app.on('window-all-closed', function() {
  app.quit();
});

// When application is ready, create application window
app.on('ready', function() {

    logger.debug("Starting application");

    // Create main window
    mainWindow = new BrowserWindow({
        name: "homepage",
        width: 800,
        height: 600,
        toolbar: false
    });

    // Target HTML file which will be opened in window
    mainWindow.loadURL('file://' + __dirname + "/index.html");

    // Cleanup when window is closed
    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    ipcMain.on('save-and-report', function(event,object) {
        logger.debug(object);
        if (object.rollno == ""){
            mainWindow.webContents.send('report-error', 'Roll Number cannot be Empty.');
        }
        else{
            mainWindow.webContents.send('report-success', 'Submitted');
        }
    });
    
    ipcMain.on('show-updates', function() {
        logger.debug("Checking for updates: " + feedURL);
        autoUpdater.checkForUpdates();
    });

});