(function($) {
	let ipcRenderer = require('electron').ipcRenderer;
	ipcRenderer.on('fileList', (event, files) => {
		$('body').html(gitlit.templates.main({files: files}));
	});
})(jQuery);
