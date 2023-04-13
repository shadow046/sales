<div style="width: 175px;">
	<a class="mtn dropdown-item mb-1 ml-1 {{ Request::is('reports') ? 'linkactive' : '' }}" href="/reports">Generate Sales Reports</a>
	<a class="mtn dropdown-item mb-1 ml-1 {{ Request::is('pdf') ? 'linkactive' : '' }}" href="/pdf">POS Uploaded Reports</a>
</div>