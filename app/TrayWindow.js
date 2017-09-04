const path = require('path');
const { BrowserWindow } = require('electron');

class TrayWindow {
  constructor() {
   
    let htmlPath = 'file://' + __dirname + '/tray_page.html'

    this.window = new BrowserWindow({
      show: false,
      height: 70,
      width: 70,
      frame: false, 
      transparent: true,
      resizable: false
    });

    this.window.loadURL(htmlPath);

    this.window.on('blur', () => {
      this.window.hide();
    });
  }
}

module.exports = TrayWindow;