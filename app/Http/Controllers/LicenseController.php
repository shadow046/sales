<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\App;
use Carbon\Carbon;
use File;
use Str;

class LicenseController extends Controller
{   
    public function showLicensePage()
    {
        $licenseKey = DB::table('licensed')->first();
        if (!empty($licenseKey)) {
            if (getenv('APP_SERVER') == "BETA") {
                if (trim(shell_exec("lsblk -no SERIAL /dev/sda")) == "") {
                    $instanceId = trim(shell_exec('curl -s http://169.254.169.254/latest/meta-data/instance-id'));
                    $expiryDate = $licenseKey->exp_date;
                    $combine = $instanceId .';'. $expiryDate .';'.'apsoft';
                    if(Hash::check($combine, Crypt::decrypt(Crypt::decrypt(Crypt::decrypt($licenseKey->key))))){
                        return redirect('/');
                    }
                }
            }
            else{
                $interface = trim(shell_exec("ip -o link show | awk -F': ' '!/lo/{print $2; exit}'"));
                $macAddress = trim(shell_exec("ip -o link show $interface | awk '{print $17}'"));
                $serialNumber = trim(shell_exec("lsblk -no SERIAL /dev/sda"));
                $expiryDate = $licenseKey->exp_date;
                $combine = $macAddress .';'. $serialNumber .';'. $expiryDate .';'. 'apsoft';
                if(Hash::check($combine, Crypt::decrypt(Crypt::decrypt(Crypt::decrypt($licenseKey->key))))){
                    return redirect('/');
                }
            }
        }

        if (getenv('APP_SERVER') == "BETA") {
            if (trim(shell_exec("lsblk -no SERIAL /dev/sda")) == "") {
                $instanceId = trim(shell_exec('curl -s http://169.254.169.254/latest/meta-data/instance-id'));
                $data = [
                    'instanceid' => $instanceId
                ];
            }
        }
        else{
            $interface = trim(shell_exec("ip -o link show | awk -F': ' '!/lo/{print $2; exit}'"));
            $macAddress = trim(shell_exec("ip -o link show $interface | awk '{print $17}'"));
            $serialNumber = trim(shell_exec("lsblk -no SERIAL /dev/sda"));
            $data = [
                'mac_address' => $macAddress,
                'serial_number' => $serialNumber,
            ];
        }

        if (!empty($data)) {
            $encryptedData = Crypt::encrypt($data);
            $iterations = 2;
            for ($i = 0; $i < $iterations; $i++) {
                $encryptedData = Crypt::encrypt($encryptedData);
            }
        }
        
        return view('license', compact('encryptedData'));
    }

    public function verifyLicense(Request $request)
    {   
        if (getenv('APP_SERVER') == "BETA") {
            if (trim(shell_exec("lsblk -no SERIAL /dev/sda")) == "") {
                $instanceId = trim(shell_exec('curl -s http://169.254.169.254/latest/meta-data/instance-id'));
                $expiryDate = Carbon::createFromFormat('Y-m-d', $request->input('expiry'))->format('Y-m-d');
                $licenseKey = $request->input('license_key');
                $combine = $instanceId .';'. $expiryDate .';'.'apsoft';
                if (Hash::check($combine, $licenseKey)) {
                    $check = App::first();
                    if ($check) {
                        $check->key = Crypt::encrypt(Crypt::encrypt(Crypt::encrypt($licenseKey)));
                        $check->exp_date = $expiryDate;
                        $check->Save();
                    }
                    else{
                        App::create(['key' => Crypt::encrypt(Crypt::encrypt(Crypt::encrypt($licenseKey))), 'exp_date' => $expiryDate]);
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
                    return redirect()->route('login');
                } else {
                    // Invalid license key
                    return redirect()->back()->withErrors(['license_key' => 'Invalid license key']);
                }
            }
        }
        else{
            $interface = trim(shell_exec("ip -o link show | awk -F': ' '!/lo/{print $2; exit}'"));
            $macAddress = trim(shell_exec("ip -o link show $interface | awk '{print $17}'"));
            $serialNumber = trim(shell_exec("lsblk -no SERIAL /dev/sda"));
            $expiryDate = Carbon::createFromFormat('Y-m-d', $request->input('expiry'))->format('Y-m-d');
            // $expectedHash = '$2y$10$NPoAi/Yw7Vh6A/VKv8KZheIb5ocbME/ACkNr.8PUWMzId5r6c9DEO'; // Example hashed value
            $licenseKey = $request->input('license_key');
            $combine = $macAddress .';'. $serialNumber .';'. $expiryDate .';'. 'apsoft';
            if (Hash::check($combine, $licenseKey)) {
                $check = App::first();
                if ($check) {
                    $check->key = Crypt::encrypt(Crypt::encrypt(Crypt::encrypt($licenseKey)));
                    $check->exp_date = $expiryDate;
                    $check->Save();
                }
                else{
                    App::create(['key' => Crypt::encrypt(Crypt::encrypt(Crypt::encrypt($licenseKey))), 'exp_date' => $expiryDate]);
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
                return redirect()->route('login');
            } else {
                // Invalid license key
                return redirect()->back()->withErrors(['license_key' => 'Invalid license key']);
            }
        }
    }
}
