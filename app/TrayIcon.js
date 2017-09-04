const path = require('path');
const { BrowserWindow, Tray } = require('electron');

const Positioner = require('electron-positioner');

class TrayIcon {
  constructor(trayWindow) {
    
    let iconPath = path.join(__dirname, '/icons/network-monitor.ico')

    this.trayIcon = new Tray(iconPath);
    this.trayIcon.setToolTip('Network Monitor'); 

    this.trayIcon.on('click', (e, bounds) => {
      if ( trayWindow.isVisible() ) {
        trayWindow.hide();
      } else {
        let positioner = new Positioner(trayWindow);
        positioner.move('trayCenter', bounds)

        trayWindow.show();
      }
    });
  }
}

module.exports = TrayIcon;