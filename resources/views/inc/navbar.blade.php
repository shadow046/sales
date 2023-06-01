@if(env('APP_SYS') == 'DD')
	<div style="height: 5px; background-color: {{$pink}}"></div>
@else
	<div style="height: 5px; background-color: {{$orange}}"></div>
@endif
<div class="container-fluid bg-default text-white d-flex" style="height: 80px; line-height: 70px;">
	@if(env('APP_SYS') == 'DD')
		<a href="/" class="xD text-white">
			<img class="mr-1" src="{{asset('inc/DD.png')}}" style="margin-top: -17px; height: 25px;">
			<b style="font-size: 35px;">HEADQUARTERS CONSOLE SYSTEM</b><b class="ml-1">{{ env('APP_SERVER') == 'BETA' ? 'BETA' : ''}}</b>
		</a>
	@else
		<a href="/" class="xD text-white">
			<img class="mr-1" src="{{asset('inc/MG.png')}}" style="margin-top: -32px; height: 55px;">
			<b style="font-size: 35px;">HEADQUARTERS CONSOLE SYSTEM</b><b class="ml-1">{{ env('APP_SERVER') == 'BETA' ? 'BETA' : ''}}</b>
		</a>
	@endif
	<table class="text-right ml-auto mb-2 align-self-end" style="color: white; font-size: 12px; line-height: 12px;">
		<thead>
			<tr>
				<td class="m-0 p-0">
					<span id="current_datetime">{{ Carbon\Carbon::now()->isoformat('dddd, MMMM DD, YYYY, h:mm:ss A') }}</span>
				</td>
				<td  class="m-0 p-0" rowspan="3">
					<i class="fa fa-user-circle fa-4x p-2" aria-hidden="true" role="button" onclick="$('#lblChangePassword').click()"></i>
				</td>
			</tr>
			<tr>
				<td class="m-0 p-0">
					<b>{{ auth()->user()->name }}</b>&nbsp;[{{ App\Models\User::select('roles.name')->where('users.id', auth()->user()->id)->join('roles', 'roles.id', 'users.userlevel')->first()->name }}]
				</td>
			</tr>
			<tr>
				<td class="m-0 p-0">
					<span id="lblChangePassword" style="text-decoration: underline; cursor: pointer;">Change Password</span>
				</td>
			</tr>
		</thead>
	</table>
</div>
<nav class="navbar navbar-expand-sm text-white w-100 navcontent" style="background-color: {{$orange}}; font-weight: bolder; zoom: 85%;">
	<div class="container-fluid">
		<ul class="navbar-nav">
			@can('dashboard')
				<li class="nav-item mr-1">
					<a class="nav-link {{ Request::is('/') ? 'navactive' : '' }}" href="/">HOME</a>
				</li>
			@endcan
			@can('sales')
				<li class="nav-item mr-1">
					<a class="nav-link {{ Request::is('sales/index') ? 'navactive' : '' }}" href="/sales/index">SALES PERFORMANCE</a>
				</li>
			@endcan
			@can('reports')
				<li class="nav-item dropdown mr-1">
					<a href="#" id="dropdownReports" class="nav-link dropdown-toggle {{ Request::is('sales/reports') || Request::is('sales/uploads') ? 'navactive' : '' }}" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">REPORTS</a>
					<div class="dropdown-menu" aria-labelledby="dropdownReports" style="width: 200%; zoom: 90%;" onmouseover="$('#dropdownReports').addClass('navhover');" onmouseout="$('#dropdownReports').removeClass('navhover');">
						<a class="dropdown-item {{ Request::is('sales/reports') ? 'linkactive' : '' }}" href="/sales/reports">Sales Analysis Reports</a>
						<a class="dropdown-item {{ Request::is('exemption/reports') ? 'linkactive' : '' }}" href="/exemption/reports">Exemption Reports</a>
						<a class="dropdown-item {{ Request::is('sales/uploads') ? 'linkactive' : '' }}" href="/sales/uploads">POS Uploaded Reports</a>
					</div>
				</li>
			@endcan
			@can('store')
				<li class="nav-item mr-1">
					<a class="nav-link {{ Request::is('store') ? 'navactive' : '' }}" href="/store">STORE</a>
				</li>
			@endcan
			@can('company')
				<li class="nav-item mr-1">
					<a class="nav-link {{ Request::is('company') ? 'navactive' : '' }}" href="/company">COMPANY</a>
				</li>
			@endcan
			@can('products')
				<li class="nav-item mr-1">
					<a class="nav-link {{ Request::is('products') ? 'navactive' : '' }}" href="/products">PRODUCTS<span style="border: 1px solid white !important;" class="badge rounded-pill bg-danger ml-2 {{ App\Models\Product::where('product_update_status', '0')->count() > 0 ? 'd-inline' : 'd-none' }}">{{ App\Models\Product::where('product_update_status', '0')->count() }}</span></a>
				</li>
			@endcan
			@can('prices')
				<li class="nav-item mr-1">
					<a class="nav-link {{ Request::is('price_update') ? 'navactive' : '' }}" href="/price_update">PRICE UPDATE<span style="border: 1px solid white;" class="badge rounded-pill bg-danger ml-2 {{ App\Models\PriceUpdate::where('price_update_status', '0')->count() > 0 ? 'd-inline' : 'd-none' }}">{{ App\Models\PriceUpdate::where('price_update_status', '0')->count() }}</span></a>
				</li>
			@endcan
			<li class="nav-item mr-1">
				<a class="nav-link {{ Request::is('update_list') ? 'navactive' : '' }}" href="/update_list">LIST OF UPDATES</a>
			</li>
			<li class="maintenance_tab nav-item dropdown mr-1">
				<a href="#" id="dropdownMaintenance" class="nav-link dropdown-toggle {{ Request::is('maintenance-*') ? 'navactive' : '' }}" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">MAINTENANCE</a>
				<div class="dropdown-menu" aria-labelledby="dropdownMaintenance" style="width: 120%; zoom: 90%;" onmouseover="$('#dropdownMaintenance').addClass('navhover');" onmouseout="$('#dropdownMaintenance').removeClass('navhover');">
					@can('pos')
						<a class="mtn dropdown-item {{ Request::is('maintenance-pos') ? 'linkactive' : '' }}" href="/maintenance-pos">POS</a>
					@endcan
					@can('categories')
						<a class="mtn dropdown-item {{ Request::is('maintenance-category') ? 'linkactive' : '' }}" href="/maintenance-category">Product Category</a>
					@endcan
					@can('salestype')
						<a class="mtn dropdown-item {{ Request::is('maintenance-sales-type') ? 'linkactive' : '' }}" href="/maintenance-sales-type">Product Sales Type</a>
					@endcan
					@can('storearea')
						<a class="mtn dropdown-item {{ Request::is('maintenance-store-area') ? 'linkactive' : '' }}" href="/maintenance-store-area">Store Area</a>
					@endcan
					@can('storetype')
						<a class="mtn dropdown-item {{ Request::is('maintenance-type') ? 'linkactive' : '' }}" href="/maintenance-type">Store Type</a>
					@endcan
					@can('storesetup')
						<a class="mtn dropdown-item {{ Request::is('maintenance-setup') ? 'linkactive' : '' }}" href="/maintenance-setup">Store Setup</a>
					@endcan
					@can('storegroup')
						<a class="mtn dropdown-item {{ Request::is('maintenance-group') ? 'linkactive' : '' }}" href="/maintenance-group">Store Group</a>
					@endcan
					@can('subgroup')
						<a class="mtn dropdown-item {{ Request::is('maintenance-sub-group') ? 'linkactive' : '' }}" href="/maintenance-sub-group">Mall Sub-Group</a>
					@endcan
					@can('network')
						<a class="mtn dropdown-item {{ Request::is('maintenance-network-setup') ? 'linkactive' : '' }}" href="/maintenance-network-setup">Store Network Setup</a>
					@endcan
					@can('delivery')
						<a class="mtn dropdown-item {{ Request::is('maintenance-delivery-channel') ? 'linkactive' : '' }}" href="/maintenance-delivery-channel">Delivery Channel</a>
					@endcan
					@can('tender')
						<a class="mtn dropdown-item {{ Request::is('maintenance-tender-type') ? 'linkactive' : '' }}" href="/maintenance-tender-type">Tender Type</a>
					@endcan
					@can('transaction')
						<a class="mtn dropdown-item {{ Request::is('maintenance-transaction-type') ? 'linkactive' : '' }}" href="/maintenance-transaction-type">Transaction Type</a>
					@endcan
					@can('discount')
						<a class="mtn dropdown-item {{ Request::is('maintenance-discount') ? 'linkactive' : '' }}" href="/maintenance-discount">Discounts</a>
					@endcan
				</div>
			</li>
			@can('roles')
				<li class="nav-item ml-4 mr-1">
					<a class="nav-link {{ Request::is('roles') ? 'navactive' : '' }}" href="/roles">ROLES</a>
				</li>
			@endcan
			@can('users')
				<li class="nav-item mr-1">
					<a class="nav-link {{ Request::is('users') ? 'navactive' : '' }}" href="/users">ACCOUNTS</a>
				</li>
			@endcan
		</ul>
		<ul class="navbar-nav mr-right">
			@can('logs')
				<li class="nav-item mr-1">
					<a class="nav-link {{ Request::is('logs') ? 'navactive' : '' }}" href="/logs">LOGS</a>
				</li>
			@endcan
			<li class="nav-item">
				<a class="nav-link" href="/logout" style="font-size: 16px;" onclick="$('#loading').show();">
					LOGOUT<i class="fa fa-sign-out ml-2"></i>
				</a>
			</li>
		</ul>
	</div>
</nav>

<input type="hidden" id="current_user" value="{{auth()->user()->id}}" readonly>
<input type="hidden" id="current_role" value="{{ App\Models\User::select('roles.name')->where('users.id', auth()->user()->id)->join('roles', 'roles.id', 'users.userlevel')->first()->name }}" readonly>
<input type="hidden" id="current_permissions" value="{{ App\Models\HasPermission::select('permission_id')->where('role_id', auth()->user()->userlevel)->get(); }}" readonly>
<input type="hidden" id="current_date" value="{{date('Y-m-d')}}" readonly>
<input type="hidden" id="current_session" value="{{\Session::getId()}}" readonly>
<input type="hidden" id="current_token" value="{{\Illuminate\Support\Str::random(50)}}" readonly>
<input type="hidden" id="current_key" value="8d4493a1-ab93-47b7-a15e-49d9918b52a5" readonly>
<input type="hidden" id="current_server" value="{{ env('APP_SERVER') }}" readonly>
<input type="hidden" id="current_system" value="{{ env('APP_SYS') }}" readonly>
<input type="hidden" id="current_timeout" value="{{ env('APP_TIMEOUT') }}" readonly>