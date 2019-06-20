(function($) {
	const ipcRenderer = require('electron').ipcRenderer;
	const remote = require('electron').remote;
	const electronFind = require('electron-find');
	let findInPage = new electronFind.FindInPage(remote.getCurrentWebContents());

	let firstRun = true;

	//events
	ipcRenderer.on('fileList', (event, files) => {
		firstRun = false;
		if (files && files.length > 0) {
			ejs.preloadTemplate('templates/files.ejs')
			.then(t => {
				$('.files-table-container').html(ejs.rr(t, {files: files}));
				sorttable.makeSortable($('.js-filestable')[0]);
				var myTH = document.getElementsByTagName('th')[0];
				sorttable.innerSortFunction.apply(myTH, []);
			});
		} else {
			$('.files-table-container').html(ejs.rr('templates/noGitLfsFiles.ejs'));
		}
	});

	ipcRenderer.on('repoDir', (event, repoDir) => {
		ejs.preloadTemplate('templates/main.ejs')
		.then(t => {
			$('.js-container').html(ejs.rr(t));
			$('.js-repo-dir').text('current repo dir: ' + repoDir).show();
		});
	});

	ipcRenderer.on('isNoGitLfsRepo', (event, repoDir) => {
		if (firstRun) {
			firstRun = false;
			$('.js-container').html(ejs.rr('templates/firstRun.ejs', {repoDir: repoDir}));
		} else {
			$('.js-container').html(ejs.rr('templates/isNoGitLfsRepo.ejs', {repoDir: repoDir}));
		}
	});

	ipcRenderer.on('notification', (event, notification) => {
		if (notification.message) {
			var notice = PNotify.alert({
				text: notification.message,
				type: notification.type, // - Type of the notice. 'notice', 'info', 'success', or 'error'.
				delay: 5000,
				modules: {
					Buttons: {
						closerHover: true
					}
				}
			});

			notice.on('click', function() {
				notice.remove();
			});
		}

		if (notification.event && notification.event === 'unlock') {
			let file = notification.file.replace(/\\/g, '\\\\');
			$('[data-file="' + file + '"].js-unlock').hide();
			$('[data-file="' + file + '"].js-lock').show();
			let text = 'not locked';
			$('[data-file="' + file + '"]').parent().prev().text(text);
		}
		if (notification.event && notification.event === 'lock') {
			let file = notification.file.replace(/\\/g, '\\\\');
			$('[data-file="' + file + '"].js-lock').hide();
			$('[data-file="' + file + '"].js-unlock').show();
			let text = notification.data.owner.name + ' (id: ' + notification.data.id + ')';
			$('[data-file="' + file + '"]').parent().prev().text(text);
		}
	});

	$(document).on('click', '.js-lock', (ev) => {
		ev.preventDefault();
		let file = $(ev.currentTarget).attr('data-file');
		ipcRenderer.send('lock', file);
	});

	$(document).on('click', '.js-unlock', (ev) => {
		ev.preventDefault();
		let file = $(ev.currentTarget).attr('data-file');
		ipcRenderer.send('unlock', file);
	});

	$(document).on('click', '.js-refresh', (ev) => {
		ev.preventDefault();
		window.location.reload(false);
	});

	$(document).on('click', '.js-open-folder', (ev) => {
		ev.preventDefault();
		$('.js-open-folder-input').trigger('click');
	});

	$(document).on('change', '.js-open-folder-input', (ev) => {
		ev.preventDefault();
		ipcRenderer.send('restart', $('.js-open-folder-input')[0].files[0].path);
	});

	$(document).on('keypress', (ev) => {
		//ctrl + f
		if (ev.ctrlKey && ev.charCode == 6) {
			findInPage.openFindWindow();
		}

		//ctrl + r
		if (ev.ctrlKey && ev.keyCode == 18) {
			window.location.reload(false);
		}
	});

	$(document).on('drop', (ev) => {
		ev.preventDefault();
		ev.stopPropagation();

		if (ev.originalEvent.dataTransfer.files && ev.originalEvent.dataTransfer.files.length > 0) {
			ipcRenderer.send('restart', ev.originalEvent.dataTransfer.files[0].path);
		}
	});

	$(document).on('dragover', (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
	});

	//startup
	PNotify.defaults.styling = 'bootstrap4'; // Bootstrap version 4

})(jQuery);
