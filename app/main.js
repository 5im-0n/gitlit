const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const electronLocalshortcut = require('electron-localshortcut');
const exec = require('child_process').exec;
const args = require('minimist')(process.argv.slice(2), {
	default: {
		_: process.cwd()
	}
});


function getLfsFileList(dir, cb) {
	exec('git lfs ls-files', {
		cwd: dir
	},
	(error, stdout, stderr) => {
		if (error) {
			cb(error);
			return;
		}
		if (stdout) {
			let files = stdout.split('\n');
			let parsedFiles = [];
			files.forEach((file) => {
				file = file.split(' * ');
				if (file[1]) {
					parsedFiles.push(file[1].trim());
				}
			});

			cb(null, parsedFiles);
		}
	});
};

function getLfsLocks(dir, cb) {
	exec('git lfs locks', {
		cwd: dir
	},
	(error, stdout, stderr) => {
		if (error) {
			cb(error);
			return;
		}
		if (stdout) {
			let files = stdout.split('\n');
			let parsedFiles = [];
			files.forEach((file) => {
				if (file) {
					let fileName = file.split('\t')[0].trim();
					let lockedBy = file.split('\t')[1].trim();
					let id = file.split('ID:')[1].trim();
					parsedFiles.push({
						file: fileName,
						lockedBy: lockedBy,
						id: id
					});
				}
			});

			cb(null, parsedFiles);
		}
	});
};

function getArrayObjectByKey(array, key, value, defaultKeyValue) {
	let o = array.filter((e) => {
		return e[key] === value;
	});
	if (o.length > 0) {
		return defaultKeyValue ? o[0][defaultKeyValue] : o[0];
	}
	return undefined;
}

function createWindow() {
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
		console.log('getting file list and lock status...');

		getLfsFileList(args._.join(' '), (err, files) => {
			getLfsLocks(args._.join(' '), (err, lockedFiles) => {
				let allFiles = [];

				files.forEach((file) => {
					const t = {
						file: file,
						lockedBy: getArrayObjectByKey(lockedFiles, 'file', file, 'lockedBy'),
						id: getArrayObjectByKey(lockedFiles, 'file', file, 'id')
					};

					allFiles.push(t);
				});

				win.webContents.send('fileList', allFiles);
			});
		});
	});
}

app.on('ready', createWindow);
