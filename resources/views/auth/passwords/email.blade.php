@if(!Auth::guest())
    <script>window.location.href = '/logout'</script>
@endif
@extends('layouts.app')
@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">{{ __('RESET PASSWORD') }}</div>
                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success p-2" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif
                    <form method="POST" action="/password/email">
                        @csrf
                        <div class="mb-3">
                            <div class="f-outline">
                                <input id="email" type="search" class="forminput form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" placeholder=" " autofocus>
                                <label for="email" class="formlabel form-label">{{ __('E-Mail Address') }}</label>
                            </div>
                            @error('email')
                                <span role="alert" style="zoom: 80%; color: red;">
                                    <b>{{ $message }}</b>
                                </span>
                            @enderror
                        </div>
                        <button type="submit" class="btn btn-primary bp">
                            {{ __('Send Password Reset Link') }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
$(document).ready(function(){
    var url = new URL(window.location.href);
    var email_address = url.searchParams.get("email");
    $('#email').val(email_address);
    alert(email_address);
});
<script>
@endsection