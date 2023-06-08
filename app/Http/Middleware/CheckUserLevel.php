<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\View;
use App\Models\User;
use Carbon\Carbon;
use Session;
use DB;
use Str;
use File;


class CheckUserLevel
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if (getenv('APP_SERVER') == 'BETA') {
            if (getenv('APP_SYS') == 'DD') {
                try {
                    $licenseKey = DB::table('licensed')->first();
                    if (empty($licenseKey)) {
                        return redirect()->route('license-page')->with('message', 'Licensed key not found. Please contact Administrator.');
                    }
                    elseif (Carbon::createFromFormat('Y-m-d', $licenseKey->exp_date) < Carbon::now()) {
                        return redirect()->route('license-page')->with('message', 'Expired license key. Please contact Administrator.');
                    }
                    elseif (trim(shell_exec("lsblk -no SERIAL /dev/sda")) == "") {
                        $instanceId = trim(shell_exec('curl -s http://169.254.169.254/latest/meta-data/instance-id'));
                        $expiryDate = $licenseKey->exp_date;
                        $combine = $instanceId .';'. $expiryDate .';'.'apsoft';
                        if(Hash::check($combine, Crypt::decrypt(Crypt::decrypt(Crypt::decrypt($licenseKey->key))))){
                            $filePath = '/var/www/html/dd/public/storage/check';
                            // Read the contents of the file
                            $fileContents = file_get_contents($filePath);
                            // Extract the date from the file contents
                            $dateString = trim($fileContents);
                            // Parse the date using Carbon
                            $fileDate = Carbon::createFromFormat('Y-m-d', Crypt::decrypt($dateString));
                            // Get the current date
                            $currentDate = Carbon::now()->subdays('2');
                            // Compare the file date with the current date
                            if ($fileDate < $currentDate) {
                                return redirect()->route('license-page')->with('message', 'Invalid licensed key. Please contact Administrator.');
                            }
                            $file = fopen($filePath, 'w');
                            fwrite($file, Crypt::encrypt(Carbon::now()->format('Y-m-d')));
                            fclose($file);
                            return $next($request);
                        }
                        else{
                            return redirect()->route('license-page')->with('message', 'Invalid licensed key. Please contact Administrator.');
                        }
                    }
                } catch (\Throwable $th) {
                    return redirect()->route('license-page');
                }
            }
            elseif (getenv('APP_SYS') == 'MG') {
                try {
                    $licenseKey = DB::table('licensed')->first();
                    if (empty($licenseKey)) {
                        return redirect()->route('license-page')->with('message', 'Licensed key not found. Please contact Administrator.');
                        // return $this->showLicensePage();
                    }
                    elseif (Carbon::createFromFormat('Y-m-d', $licenseKey->exp_date) < Carbon::now()) {
                        return redirect()->route('license-page')->with('message', 'Expired license key. Please contact Administrator.');
                    }
                    elseif (trim(shell_exec("lsblk -no SERIAL /dev/sda")) == "") {
                        $instanceId = trim(shell_exec('curl -s http://169.254.169.254/latest/meta-data/instance-id'));
                        $expiryDate = $licenseKey->exp_date;
                        $combine = $instanceId .';'. $expiryDate .';'.'apsoft';
                        if(Hash::check($combine, Crypt::decrypt(Crypt::decrypt(Crypt::decrypt($licenseKey->key))))){
                            $filePath = '/var/www/html/mary_grace/public/storage/check';
                            // Read the contents of the file
                            $fileContents = file_get_contents($filePath);
                            // Extract the date from the file contents
                            $dateString = trim($fileContents);
                            // Parse the date using Carbon
                            $fileDate = Carbon::createFromFormat('Y-m-d', Crypt::decrypt($dateString));
                            // Get the current date
                            $currentDate = Carbon::now()->subdays('2');
                            // Compare the file date with the current date
                            // if ($fileDate < $currentDate) {
                            //     return redirect()->route('license-page')->with('message', 'Invalid licensed key. Please contact Administrator.');
                            // }
                            $file = fopen($filePath, 'w');
                            fwrite($file, Crypt::encrypt(Carbon::now()->format('Y-m-d')));
                            fclose($file);
                            return $next($request);
                        }
                        else{
                            // return redirect()->route('invalid');
                            return redirect()->route('license-page')->with('message', 'Invalid licensed key. Please contact Administrator.');
                        }
                    }
                } catch (\Throwable $th) {
                    // return redirect()->route('invalid');
                    return redirect()->route('license-page');
                }
            }
            return $next($request);
        }
        elseif (getenv('APP_SERVER') == 'LOCAL') {
            if (getenv('APP_SYS') == 'DD') {
                try {
                    $licenseKey = DB::table('licensed')->first();
                    if (empty($licenseKey)) {
                        return redirect()->route('license-page')->with('message', 'Licensed key not found. Please contact Administrator.');
                    }
                    elseif (Carbon::createFromFormat('Y-m-d', $licenseKey->exp_date) < Carbon::now()) {
                        return redirect()->route('license-page')->with('message', 'Expired license key. Please contact Administrator.');
                    }
                    else{
                        $interface = trim(shell_exec("ip -o link show | awk -F': ' '!/lo/{print $2; exit}'"));
                        $macAddress = trim(shell_exec("ip -o link show $interface | awk '{print $17}'"));
                        $serialNumber = trim(shell_exec("lsblk -no SERIAL /dev/sda"));
                        $expiryDate = $licenseKey->exp_date;
                        $combine = $macAddress .';'. $serialNumber .';'. $expiryDate .';'. 'apsoft';
                        if(Hash::check($combine, Crypt::decrypt(Crypt::decrypt(Crypt::decrypt($licenseKey->key))))){
                            $filePath = '/var/www/html/dunkin/public/storage/check';
                            // Read the contents of the file
                            $fileContents = file_get_contents($filePath);
                            // Extract the date from the file contents
                            $dateString = trim($fileContents);
                            // Parse the date using Carbon
                            $fileDate = Carbon::createFromFormat('Y-m-d', Crypt::decrypt($dateString));
                            // Get the current date
                            $currentDate = Carbon::now()->subdays('2');
                            // Compare the file date with the current date
                            // if ($fileDate < $currentDate) {
                            //     return redirect()->route('license-page')->with('message', 'Invalid licensed key. Please contact Administrator.');
                            // }
                            $file = fopen($filePath, 'w');
                            fwrite($file, Crypt::encrypt(Carbon::now()->format('Y-m-d')));
                            fclose($file);
                            return $next($request);
                        }
                        else{
                            return redirect()->route('license-page')->with('message', 'Invalid licensed key. Please contact Administrator.');
                        }
                    }
                } catch (\Throwable $th) {
                    return redirect()->route('license-page')->with('message', 'Invalid licensed key. Please contact Administrator.');
                }
            }
            elseif (getenv('APP_SYS') == 'MG') {
                try {
                    $licenseKey = DB::table('licensed')->first();
                    if (empty($licenseKey)) {
                        return redirect()->route('license-page')->with('message', 'Licensed key not found. Please contact Administrator.');
                    }
                    elseif (Carbon::createFromFormat('Y-m-d', $licenseKey->exp_date) < Carbon::now()) {
                        return redirect()->route('license-page')->with('message', 'Expired license key. Please contact Administrator.');
                    }
                    else{
                        $interface = trim(shell_exec("ip -o link show | awk -F': ' '!/lo/{print $2; exit}'"));
                        $macAddress = trim(shell_exec("ip -o link show $interface | awk '{print $17}'"));
                        $serialNumber = trim(shell_exec("lsblk -no SERIAL /dev/sda"));
                        $expiryDate = $licenseKey->exp_date;
                        $combine = $macAddress .';'. $serialNumber .';'. $expiryDate .';'. 'apsoft';
                        if(Hash::check($combine, Crypt::decrypt(Crypt::decrypt(Crypt::decrypt($licenseKey->key))))){
                            $filePath = '/var/www/html/mg/public/storage/check';
                            // Read the contents of the file
                            $fileContents = file_get_contents($filePath);
                            // Extract the date from the file contents
                            $dateString = trim($fileContents);
                            // Parse the date using Carbon
                            $fileDate = Carbon::createFromFormat('Y-m-d', Crypt::decrypt($dateString));
                            // Get the current date
                            $currentDate = Carbon::now()->subdays('2');
                            // Compare the file date with the current date
                            // if ($fileDate < $currentDate) {
                            //     return redirect()->route('license-page')->with('message', 'Date has changed,Invalid licensed key. Please contact Administrator.');
                            // }
                            $file = fopen($filePath, 'w');
                            fwrite($file, Crypt::encrypt(Carbon::now()->format('Y-m-d')));
                            fclose($file);
                        }
                        else{
                            return redirect()->route('license-page')->with('message', 'Invalid licensed key. Please contact Administrator.');
                        }

                    }
                } catch (\Throwable $th) {
                    return redirect()->route('license-page')->with('message', 'Invalid licensed key. Please contact Administrator.');
                }
            }
            return $next($request);
        }
        return $next($request);
    }
}
