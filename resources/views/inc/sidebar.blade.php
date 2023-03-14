<div id="sidebar" class="sidebar flex-shrink-0 d-none" style="border-top: 5px solid {{$pink}};">{{--ARCHIVED--}}
	<div class="px-0 pt-2">
		<ul class="list-unstyled bg-default pb-3" id="dashboard" style="margin-top: -15px; margin-left: -8px; border-bottom: 4px solid white;">
			<li class="mb-1 pt-4 pb-1 pl-3" style="zoom: 120%;">
				<b>DASHBOARD MENU</b>
			</li>
		</ul>
		<ul class="list-unstyled p-0">
			<li class="mb-1">
				<a href="/" class="link-light rounded mt-1">
					<button id="salesBy" class="btn btn-toggle align-items-center rounded collapsed font-weight-bold btnSideBar">
						HOME
					</button>
				</a>
			</li>
			<li class="mb-1">
				<button id="salesBy" class="btn btn-toggle align-items-center rounded collapsed font-weight-bold btnSideBar" data-bs-toggle="collapse" data-bs-target="#salesBy-collapse" aria-expanded="false">
					SALES BY ITEM CATEGORY:
				</button>
				<div class="collapse" id="salesBy-collapse">
					<ul class="btn-toggle-nav list-unstyled fw-normal ml-2 pl-4 pb-1 small" style="zoom: 125%;">
						{{-- <li><a href="/sales/category" class="link-light rounded mt-1 {{ Request::is('sales/category') ? 'active' : '' }}">CATEGORY</a></li> --}}
						<li><a href="/sales/daily" class="link-light rounded mt-1 {{ Request::is('sales/daily') ? 'active' : '' }}">DAILY</a></li>
						{{-- <li><a href="/sales/weekly" class="link-light rounded mt-1 {{ Request::is('sales/weekly') ? 'active' : '' }}">WEEKLY</a></li> --}}
						<li><a href="/sales/monthly" class="link-light rounded mt-1 {{ Request::is('sales/monthly') ? 'active' : '' }}">MONTHLY</a></li>
					</ul>
				</div>
			</li>
			{{-- <li class="mb-1">
				<button id="promo" class="btn btn-toggle align-items-center rounded collapsed font-weight-bold btnSideBar" data-bs-toggle="collapse" data-bs-target="#promo-collapse" aria-expanded="false">
					PROMOS:
				</button>
				<div class="collapse" id="promo-collapse">
					<ul class="btn-toggle-nav list-unstyled fw-normal ml-2 pl-4 pb-1 small" style="zoom: 125%;">
						<li><a href="#" class="link-light rounded mt-1">COMBO</a></li>
						<li><a href="#" class="link-light rounded mt-1">PROMO</a></li>
					</ul>
				</div>
			</li> --}}
			<li class="mb-1">
				<a href="/sales/transaction" class="link-light rounded mt-1">
				<button id="transaction" class="btn btn-toggle align-items-center rounded collapsed font-weight-bold btnSideBar" data-bs-toggle="collapse" data-bs-target="#transaction-collapse" aria-expanded="false">
					TRANSACTION TYPES:
				</button>
				</a>
				{{-- <div class="collapse" id="transaction-collapse">
					<ul class="btn-toggle-nav list-unstyled fw-normal ml-2 pl-4 pb-1 small" style="zoom: 125%;">
						<li><a href="/sales/dine-in" class="link-light rounded mt-1">DINE-IN</a></li>
						<li><a href="/sales/take-out" class="link-light rounded mt-1">TAKEOUT</a></li>
						<li><a href="/sales/drive-thru" class="link-light rounded mt-1">DRIVE THRU</a></li>
					</ul>
				</div> --}}
			</li>
			<li class="mb-1">
				<button id="tender" class="btn btn-toggle align-items-center rounded collapsed font-weight-bold btnSideBar" data-bs-toggle="collapse" data-bs-target="#tender-collapse" aria-expanded="false">
					TENDER TYPES:
				</button>
				<div class="collapse" id="tender-collapse">
					<ul class="btn-toggle-nav list-unstyled fw-normal ml-2 pl-4 pb-1 small" style="zoom: 125%;">
						<li><a href="cash" class="link-light rounded mt-1">CASH</a></li>
						<li><a href="gcash" class="link-light rounded mt-1">GCASH</a></li>
						<li><a href="#" class="link-light rounded mt-1">DEBIT CARD</a></li>
						<li><a href="maya" class="link-light rounded mt-1">MAYA</a></li>
						{{-- <li><a href="#" class="link-light rounded mt-1">OTHERS</a></li> --}}
					</ul>
				</div>
			</li>
			<li class="mb-1">
				<button id="store" class="btn btn-toggle align-items-center rounded collapsed font-weight-bold btnSideBar" data-bs-toggle="collapse" data-bs-target="#store-collapse" aria-expanded="false">
					STORE TYPE:
				</button>
				<div class="collapse" id="store-collapse">
					<ul class="btn-toggle-nav list-unstyled fw-normal ml-2 pl-4 pb-1 small" style="zoom: 125%;">
						<li><a href="#" class="link-light rounded mt-1">FULL STORE</a></li>
						<li><a href="#" class="link-light rounded mt-1">FULL DRIVE THRU</a></li>
						<li><a href="#" class="link-light rounded mt-1">MINI DRIVE THRU</a></li>
						<li><a href="#" class="link-light rounded mt-1">KIOSK</a></li>
					</ul>
				</div>
			</li>
			<li class="mb-1">
				<button id="location" class="btn btn-toggle align-items-center rounded collapsed font-weight-bold btnSideBar" data-bs-toggle="collapse" data-bs-target="#location-collapse" aria-expanded="false">
					LOCATION:
				</button>
				{{-- <div class="collapse" id="location-collapse">
					{{-- <ul class="btn-toggle-nav list-unstyled fw-normal ml-2 pl-4 pb-1 small" style="zoom: 125%;">
						<li><a href="#" class="link-light rounded mt-1">SENIOR</a></li>
						<li><a href="#" class="link-light rounded mt-1">PWD</a></li>
					</ul>
				</div> --}}
			</li>
			<li class="mb-1">
				<button id="discount" class="btn btn-toggle align-items-center rounded collapsed font-weight-bold btnSideBar" data-bs-toggle="collapse" data-bs-target="#discount-collapse" aria-expanded="false">
					DISCOUNTS:
				</button>
				<div class="collapse" id="discount-collapse">
					<ul class="btn-toggle-nav list-unstyled fw-normal ml-2 pl-4 pb-1 small" style="zoom: 125%;">
						<li><a href="#" class="link-light rounded mt-1">SENIOR</a></li>
						<li><a href="#" class="link-light rounded mt-1">PWD</a></li>
					</ul>
				</div>
			</li>
		</ul>
	</div>
</div>
<div id="sidehover"></div>