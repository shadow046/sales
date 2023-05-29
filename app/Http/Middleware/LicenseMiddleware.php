<?php

namespace App\Http\Middleware;
use Illuminate\Http\Request;

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

        if (getenv('APP_SERVER') == 'BETA') {
            if (getenv('APP_SYS') == 'DD') {
                if (Request::capture()->getHost() != 'dunkin.apsoft.com.ph') {
                    return redirect()->to('http://dunkin.apsoft.com.ph');
                }
            }
            else if (getenv('APP_SYS') == 'MG') {
                if (Request::capture()->getHost() != 'marygrace.apsoft.com.ph') {
                    return redirect()->to('http://marygrace.apsoft.com.ph');
                }
            }
        }
        
        return $next($request);
    }
}
