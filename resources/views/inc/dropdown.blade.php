<div style="width: 175px;">
	@can('pos')
		<a class="mtn dropdown-item mb-1 ml-1 {{ Request::is('maintenance-pos') ? 'linkactive' : '' }}" href="/maintenance-pos">POS</a>
	@endcan
	@can('categories')
		<a class="mtn dropdown-item mb-1 ml-1 {{ Request::is('maintenance-category') ? 'linkactive' : '' }}" href="/maintenance-category">Product Category</a>
	@endcan
	@can('salestype')
		<a class="mtn dropdown-item mb-1 ml-1 {{ Request::is('maintenance-sales-type') ? 'linkactive' : '' }}" href="/maintenance-sales-type">Product Sales Type</a>
	@endcan
	@can('storearea')
		<a class="mtn dropdown-item mb-1 ml-1 {{ Request::is('maintenance-store-area') ? 'linkactive' : '' }}" href="/maintenance-store-area">Store Area</a>
	@endcan
	@can('storetype')
		<a class="mtn dropdown-item mb-1 ml-1 {{ Request::is('maintenance-type') ? 'linkactive' : '' }}" href="/maintenance-type">Store Type</a>
	@endcan
	@can('storesetup')
		<a class="mtn dropdown-item mb-1 ml-1 {{ Request::is('maintenance-setup') ? 'linkactive' : '' }}" href="/maintenance-setup">Store Setup</a>
	@endcan
	@can('storegroup')
		<a class="mtn dropdown-item mb-1 ml-1 {{ Request::is('maintenance-group') ? 'linkactive' : '' }}" href="/maintenance-group">Store Group</a>
	@endcan
	@can('subgroup')
		<a class="mtn dropdown-item mb-1 ml-1 {{ Request::is('maintenance-sub-group') ? 'linkactive' : '' }}" href="/maintenance-sub-group">Mall Sub-Group</a>
	@endcan
	@can('network')
		<a class="mtn dropdown-item mb-1 ml-1 {{ Request::is('maintenance-network-setup') ? 'linkactive' : '' }}" href="/maintenance-network-setup">Store Network Setup</a>
	@endcan
	@can('delivery')
		<a class="mtn dropdown-item mb-1 ml-1 {{ Request::is('maintenance-delivery-channel') ? 'linkactive' : '' }}" href="/maintenance-delivery-channel">Delivery Channel</a>
	@endcan
	@can('tender')
		<a class="mtn dropdown-item mb-1 ml-1 {{ Request::is('maintenance-tender-type') ? 'linkactive' : '' }}" href="/maintenance-tender-type">Tender Type</a>
	@endcan
	{{-- @can('tender') --}}
		<a class="mtn dropdown-item mb-1 ml-1 {{ Request::is('maintenance-transaction-type') ? 'linkactive' : '' }}" href="/maintenance-transaction-type">Transaction Type</a>
	{{-- @endcan --}}
	{{-- @can('tender') --}}
		<a class="mtn dropdown-item mb-1 ml-1 {{ Request::is('maintenance-discount') ? 'linkactive' : '' }}" href="/maintenance-discount">Discounts</a>
	{{-- @endcan --}}
</div>