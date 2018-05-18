window.gitlit = window.gitlit || {};
gitlit.templates = {
	main: ejs.compile(`
		<table class="table">
		<tr>
			<th>file</th>
			<th>status</th>
			<th>action</th>
		</tr>

		<% files.forEach((file) => { %>
			<tr class="<%= file.lockedBy ? 'alert alert-danger' : '' %>">
				<td><%= file.file %></td>
				<td><%= file.lockedBy ? file.lockedBy + ' (id: ' + file.id + ')' : 'not locked' %></td>
				<td>
					<a class="btn btn-<%= file.lockedBy ? 'danger' : 'primary' %>"
						href="javascript:///">
						<%= file.lockedBy ? 'Unlock' : 'Lock' %>
					</a>
				</td>
			</tr>
		<% }); %>

		</table>
		`)
};
