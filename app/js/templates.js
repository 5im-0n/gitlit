window.gitlit = window.gitlit || {};
gitlit.templates = {
	main: ejs.compile(`
		<table class="table table-striped">
		<tr>
			<th>file</th>
			<th>status</th>
			<th>action</th>
		</tr>
		<tr>
			<td>ciccio.txt</td>
			<td>locked</td>
			<td></td>
		</tr>
		</table>
		`)
};
