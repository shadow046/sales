<div class="content">
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
</div>
<nav class="navbar navbar-expand-sm text-white w-100 content" style="background-color: {{$orange}}; font-weight:bolder;">
	<div class="container-fluid">
		<ul class="navbar-nav">
			@if(env('APP_SYS') == 'DD')
				@can('dashboard')
					<li class="nav-item mr-1">
						<a class="nav-link {{ Request::is('/') ? 'navactive' : '' }}" href="/">HOME</a>
					</li>
				@endcan
			@endif
			@can('sales')
				<li class="nav-item mr-1">
					<a class="nav-link {{ Request::is('sales/index') ? 'navactive' : '' }}" href="/sales/index">SALES PERFORMANCE</a>
				</li>
			@endcan
			@can('home')
				<li class="nav-item mr-1">
					<a class="nav-link {{ Request::is('sales/index') ? 'navactive' : '' }}" href="/sales/index">SALES PERFORMANCE</a>
				</li>
			@endcan
			@can('reports')
				<li class="nav-item mr-1">
					<a class="nav-link {{ Request::is('reports') ? 'navactive' : '' }}" href="/reports">REPORTS</a>
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
			@if(env('APP_SYS') == 'DD')
				@can('prices')
					<li class="nav-item mr-1">
						<a class="nav-link {{ Request::is('price_update') ? 'navactive' : '' }}" href="/price_update">PRICE UPDATE<span style="border: 1px solid white;" class="badge rounded-pill bg-danger ml-2 {{ App\Models\PriceUpdate::where('price_update_status', '0')->count() > 0 ? 'd-inline' : 'd-none' }}">{{ App\Models\PriceUpdate::where('price_update_status', '0')->count() }}</span></a>
					</li>
				@endcan
			@endif
			<li class="maintenance_tab nav-item dropdown mr-1">
				<a href="#" id="maintenance" class="nav-link dropdown-toggle {{ Request::is('maintenance-*') ? 'navactive' : '' }}" data-bs-toggle="popover" data-bs-placement="bottom" data-bs-trigger="focus" data-bs-html="true" data-bs-content='@include("inc.dropdown")'>MAINTENANCE</a>
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
<input type="hidden" id="current_token" value="{{\Illuminate\Support\Str::random(25)}}" readonly>
<input type="hidden" id="current_key" value="8d4493a1-ab93-47b7-a15e-49d9918b52a5" readonly>
<input type="hidden" id="current_server" value="{{ env('APP_SERVER') }}" readonly>
<input type="hidden" id="current_system" value="{{ env('APP_SYS') }}" readonly>
<input type="hidden" id="current_timeout" value="{{ env('APP_TIMEOUT') }}" readonly>