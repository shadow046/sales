<div style="width: 175px;">
	<a class="dropdown-item mb-1 ml-1 {{ Request::is('sales/daily') ? 'linkactive' : '' }}" href="/sales/daily">Daily</a>
	<a class="dropdown-item mb-1 ml-1 {{ Request::is('sales/monthly') ? 'linkactive' : '' }}" href="/sales/monthly">Monthly</a>
</div>