<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\DB;

class LicenseMiddleware
{
    public function handle($request, Closure $next)
    {
        // Check if the license key exists in the database
        $licenseKey = DB::table('licensed')->first();
        if (empty($licenseKey)) {
            // License key is blank or doesn't exist
            return redirect()->route('license-page');
            // return response()->json(['message' => "License key not found. Please send this code to developer $encryptedData"], 403);
        }
        return $next($request);
    }
}
