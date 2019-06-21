const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const electronLocalshortcut = require('electron-localshortcut');
const exec = require('child_process').exec;
const args = require('minimist')(process.defaultApp ? process.argv.slice(3) : process.argv.slice(1), {
	default: {
		_: process.cwd()
	}
});

let win;
let repoDir = path.resolve(path.normalize(args._.join(' ')));
let repoRootDir = repoDir;

function getLfsFileList(dir, cb) {
	exec('git ls-files | git check-attr --stdin lockable', {
		maxBuffer: 1024 * 1024,
		cwd: dir
	},
	(error, stdout, stderr) => {
		if (error) {
			cb(error);
			return;
		}

		let parsedFiles = [];
		if (stdout) {
			let files = stdout.split('\n');
			files.forEach((file) => {
				let pos = file.split(': lockable: ');
				if (pos && pos.length === 2) {
					file = pos[0];
					status = pos[1];
					if (file && status === 'set') {
						parsedFiles.push(path.normalize(file.trim()));
					}
				}
			});

			cb(null, parsedFiles);
		} else {
			cb(null, parsedFiles);
		}
	});
};

function getLfsLocks(dir, cb) {
	exec('git lfs locks', {
		maxBuffer: 1024 * 1024,
		cwd: dir
	},
	(error, stdout, stderr) => {
		if (error) {
			cb(error);
			return;
		}

		let parsedFiles = [];
		if (stdout) {
			let files = stdout.split('\n');
			files.forEach((file) => {
				if (file) {
					let fileName = path.normalize(file.split('\t')[0].trim());
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
		} else {
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
};

function loadRepoPage() {
	win.webContents.send('repoDir', repoDir);

	getLfsFileList(repoDir, (err, files) => {
		if (err) {
			console.error(err);

			win.webContents.send('isNoGitLfsRepo', repoDir);
			return;
		}
		getLfsLocks(repoDir, (err, lockedFiles) => {
			if (err) {
				console.error(err);

				win.webContents.send('isNoGitLfsRepo', repoDir);
				return;
			}
			let allFiles = [];
			let repoDirWithoutRoot = repoDir === repoRootDir ? '' : repoDir.replace(path.normalize(repoRootDir + '/'), '');

			files.forEach((file) => {
				const t = {
					file: file,
					lockedBy: getArrayObjectByKey(lockedFiles, 'file', path.normalize(repoDirWithoutRoot ? repoDirWithoutRoot + '/' + file : file), 'lockedBy'),
					id: getArrayObjectByKey(lockedFiles, 'file', path.normalize(repoDirWithoutRoot ? repoDirWithoutRoot + '/' + file : file), 'id')
				};

				allFiles.push(t);
			});

			win.webContents.send('fileList', allFiles);
		});
	});
};

function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({width: 800, height: 700});
	win.setMenu(null);

	// and load the index.html of the app.
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	electronLocalshortcut.register(win, 'F12', () => {
		win.webContents.toggleDevTools();
	});

	win.webContents.on('did-finish-load', () => {
		loadRepoPage();
	});
};

function startup(cb) {
	exec('git rev-parse --show-toplevel', {
		maxBuffer: 1024 * 1024,
		cwd: repoDir
	},
	(error, stdout, stderr) => {
		if (error) {
			if (win) {
				win.webContents.send('isNoGitLfsRepo', repoDir);
			}
			console.error(error);
		}

		if (stdout) {
			repoRootDir = path.normalize(stdout.replace(/\n/g, ''));
		}

		if (cb) {
			cb();
		}
	});
};

ipcMain.on('unlock', (event, file) => {
	exec('git lfs unlock "' + file + '"', {
		maxBuffer: 1024 * 1024,
		cwd: repoDir
	},
	(error, stdout, stderr) => {
		let notification = {
			message: (error && error.message) || stderr,
			type: 'error'
		};

		if (stdout) {
			notification = {
				file: file,
				event: 'unlock',
				type: 'info'
			};
		}

		win.webContents.send('notification', notification);
	});
});

ipcMain.on('lock', (event, file) => {
	exec('git lfs lock --json "' + file + '"', {
		maxBuffer: 1024 * 1024,
		cwd: repoDir
	},
	(error, stdout, stderr) => {
		let notification = {
			message: (error && error.message) || stderr,
			type: 'error'
		};

		if (stdout) {
			notification = {
				file: file,
				event: 'lock',
				data: JSON.parse(stdout),
				type: 'info'
			};
		}

		win.webContents.send('notification', notification);
	});
});

ipcMain.on('restart', (event, newRepoDir) => {
	repoDir = newRepoDir;
	startup(loadRepoPage);
});

app.on('ready', () => {
	startup(createWindow);
});

app.on('window-all-closed', function() {
	if (process.platform != 'darwin') {
		app.quit();
	}
});
