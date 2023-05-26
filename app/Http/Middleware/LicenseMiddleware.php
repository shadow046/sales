<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Licensed;

class LicenseMiddleware
{
    public function handle($request, Closure $next)
    {
        $licenseKey = Licensed::first();
        if (empty($licenseKey)) {
            return redirect()->route('license-page')->with('message', 'Licensed key not found. Please contact Administrator.');
        }
        return $next($request);
    }
}
