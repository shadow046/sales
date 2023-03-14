<div style="width: 175px;">
	<a class="dropdown-item mb-1 ml-1 {{ Request::is('sales/cash') ? 'linkactive' : '' }}" href="/sales/cash">POS</a>
	<a class="dropdown-item mb-1 ml-1 {{ Request::is('sales/gcash') ? 'linkactive' : '' }}" href="/sales/gcash">Product Category</a>
	<a class="dropdown-item mb-1 ml-1 {{ Request::is('sales/debit-card') ? 'linkactive' : '' }}" href="/sales/debit-card">Product Sales Type</a>
	<a class="dropdown-item mb-1 ml-1 {{ Request::is('sales/maya') ? 'linkactive' : '' }}" href="/sales/maya">Store Type</a>
</div>