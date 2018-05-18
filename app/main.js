const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const electronLocalshortcut = require('electron-localshortcut');


function createWindow () {
	// Create the browser window.
	win = new BrowserWindow({width: 800, height: 600});
	win.setMenu(null);

	// and load the index.html of the app.
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))

	electronLocalshortcut.register(win, 'F12', () => {
		win.webContents.toggleDevTools();
	});

	win.webContents.on('did-finish-load', () => {
		win.webContents.send('ping', 'whoooooooh!')
	});
}

app.on('ready', createWindow);
