(function($) {
	require('electron').ipcRenderer.on('ping', (event, message) => {
		console.log(message) // Prints 'whoooooooh!'
	})
})(jQuery);
