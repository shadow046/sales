<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Session;
use App\Models\User;
use DB;
use Carbon\Carbon;
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
                        return redirect()->route('license-page');
                    }
                    else{
                        if (trim(shell_exec("lsblk -no SERIAL /dev/sda")) == "") {
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
                                    return redirect()->route('invalid');
                                }
                                if (Str::contains($request->url(), 'mg')) {
                                    $filename = '/'.'var/www/html/mary_grace/public/storage/check';
                                }
                                else if (Str::contains($request->url(), 'dd')) {
                                    $filename = '/'.'var/www/html/dd/public/storage/check';
                                }
                                $file = fopen($filename, 'w');
                                fwrite($file, Crypt::encrypt(Carbon::now()->format('Y-m-d')));
                                fclose($file);

                                return $next($request);
                            }
                            else{
                                return redirect()->route('invalid');
                            }
                        }
                        else{
                            $interface = trim(shell_exec("ip -o link show | awk -F': ' '!/lo/{print $2; exit}'"));
                            $macAddress = trim(shell_exec("ip -o link show $interface | awk '{print $17}'"));
                            $serialNumber = trim(shell_exec("lsblk -no SERIAL /dev/sda"));
                            $expiryDate = $licenseKey->exp_date;
                            $combine = $macAddress .';'. $serialNumber .';'. $expiryDate .';'. 'apsoft';
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
                                    return redirect()->route('invalid');
                                }
                                if (Str::contains($request->url(), 'mg')) {
                                    $filename = '/'.'var/www/html/mary_grace/public/storage/check';
                                }
                                else if (Str::contains($request->url(), 'dd')) {
                                    $filename = '/'.'var/www/html/dd/public/storage/check';
                                }
                                $file = fopen($filename, 'w');
                                fwrite($file, Crypt::encrypt(Carbon::now()->format('Y-m-d')));
                                fclose($file);

                                return $next($request);
                            }
                            else{
                                return redirect()->route('invalid');
                            }
                        }
                    }
                } catch (\Throwable $th) {
                    return redirect()->route('invalid');
                }
            }
            return $next($request);
        }
        return $next($request);
    }
}
