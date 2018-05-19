(function($) {
	const ipcRenderer = require('electron').ipcRenderer;
	const searchInPage = require('electron-in-page-search').default;
	const remote = require('electron').remote;

	let inPageSearch = searchInPage();


	//events
	ipcRenderer.on('fileList', (event, files) => {
		$('.js-container').html(gitlit.templates.main({files: files}));
	});

	ipcRenderer.on('isNoGitLfsRepo', (event, repoDir) => {
		$('.js-container').html(gitlit.templates.isNoGitLfsRepo({repoDir: repoDir}));
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
			$('[data-file="' + notification.file + '"].js-unlock').hide();
			$('[data-file="' + notification.file + '"].js-lock').show();
			let text = 'not locked';
			$('[data-file="' + notification.file + '"]').parent().prev().text(text);
		}
		if (notification.event && notification.event === 'lock') {
			$('[data-file="' + notification.file + '"].js-lock').hide();
			$('[data-file="' + notification.file + '"].js-unlock').show();
			let text = notification.data.owner.name + ' (id: ' + notification.data.id + ')';
			$('[data-file="' + notification.file + '"]').parent().prev().text(text);
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

	$(document).on('keypress', (ev) => {
		//ctrl + f
		if (ev.ctrlKey && ev.charCode == 6) {
			if (inPageSearch && inPageSearch.opened) {
				inPageSearch.closeSearchWindow();
			} else {
				inPageSearch.searchTarget = remote.getCurrentWebContents();
				inPageSearch.openSearchWindow();
			}
		}
	});

	//startup
	PNotify.defaults.styling = 'bootstrap4'; // Bootstrap version 4

})(jQuery);
