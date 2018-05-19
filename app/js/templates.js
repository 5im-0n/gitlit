window.gitlit = window.gitlit || {};
gitlit.templates = {
	main: ejs.compile(`
		<table class="table table-striped sortable js-filestable">
		<tr>
			<th>file</th>
			<th>status</th>
			<th>action</th>
		</tr>

		<% files.forEach((file) => { %>
			<tr>
				<td><%= file.file %></td>
				<td><%= file.lockedBy ? file.lockedBy + ' (id: ' + file.id + ')' : 'not locked' %></td>
				<td>
					<a class="btn btn-primary js-lock"
						href="javascript:///"
						data-file="<%= file.file %>"
						style="<%= file.lockedBy ? 'display: none;' : '' %>"
					>
						Lock
					</a>
					<a class="btn btn-danger js-unlock"
						href="javascript:///"
						data-file="<%= file.file %>"
						style="<%= file.lockedBy ? '' : 'display: none;' %>"
					>
						Unlock
					</a>
				</td>
			</tr>
		<% }); %>

		</table>

		<div class="float-right">
			<a class="btn btn-secondary js-refresh" href="javascript:///">
				Refresh
			</a>
		</div>
	`),
	isNoGitLfsRepo: ejs.compile(`
		<div class="alert alert-danger">
			<%= repoDir %> is not a git lfs repo.
		</div>
	`)
};
