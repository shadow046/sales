<div style="width: 175px;">
	<a class="dropdown-item mb-1 ml-1 {{ Request::is('sales/full-store') ? 'linkactive' : '' }}" href="#">Full Store</a>
	<a class="dropdown-item mb-1 ml-1 {{ Request::is('sales/full-drive-thru') ? 'linkactive' : '' }}" href="#">Full Drive-Thru</a>
	<a class="dropdown-item mb-1 ml-1 {{ Request::is('sales/mini-drive-thru') ? 'linkactive' : '' }}" href="#">Mini Drive-Thru</a>
	<a class="dropdown-item mb-1 ml-1 {{ Request::is('sales/kiosk') ? 'linkactive' : '' }}" href="#">Kiosk</a>
</div>