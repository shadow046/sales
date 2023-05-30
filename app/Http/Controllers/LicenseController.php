<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Models\App;
use App\Models\Licensed;
use Carbon\Carbon;
use File;
use Str;

class LicenseController extends Controller
{   
    private function encryptData($data)
    {
        $key = config('app.key');
        $cipher = config('app.cipher');

        $iv = random_bytes(openssl_cipher_iv_length($cipher));
        $encrypted = openssl_encrypt($data, $cipher, $key, 0, $iv);

        // Combine the encrypted data and the initialization vector (IV)
        $encryptedData = base64_encode($iv . $encrypted);

        return $encryptedData;
    }

    private function decryptData($encryptedData)
    {
        $key = config('app.key');
        $cipher = config('app.cipher');

        $data = base64_decode($encryptedData);
        $iv = substr($data, 0, openssl_cipher_iv_length($cipher));
        $encrypted = substr($data, openssl_cipher_iv_length($cipher));

        $decrypted = openssl_decrypt($encrypted, $cipher, $key, 0, $iv);

        return $decrypted;
    }

    public function showLicensePage()
    {
        $license = Licensed::first();
        $expiryDate = $license->exp_date;
        if (getenv('APP_SERVER') == "BETA") {
            if (trim(shell_exec("lsblk -no SERIAL /dev/sda")) == "") {
                $instanceId = trim(shell_exec('curl -s http://169.254.169.254/latest/meta-data/instance-id'));
                $combine = $instanceId .';'. $expiryDate .';'.'apsoft';
                $data = [
                    'instanceid' => $instanceId,
                ];
            }
        }
        else{
            $interface = trim(shell_exec("ip -o link show | awk -F': ' '!/lo/{print $2; exit}'"));
            $macAddress = trim(shell_exec("ip -o link show $interface | awk '{print $17}'"));
            $serialNumber = trim(shell_exec("lsblk -no SERIAL /dev/sda"));
            $combine = $macAddress .';'. $serialNumber .';'. $expiryDate .';'. 'apsoft';
            $data = [
                'mac_address' => $macAddress,
                'serial_number' => $serialNumber,
            ];
        }
        
        // if ($license) {
        //     if (Carbon::createFromFormat('Y-m-d', $expiryDate) > Carbon::now()) {
        //         if (Hash::check($combine, Crypt::decrypt(Crypt::decrypt(Crypt::decrypt($license->key))))) {
        //             return redirect()->route('login');
        //         }
        //     }
        // }

        $code = $this->encryptData(json_encode($data));
        $appK = config('app.key');
        $appC = config('app.cipher');
        $data = "$code&appK=$appK&appK=".getenv('APP_SYS');

        return view('license', compact('data'));
    }

    public function verifyLicense(Request $request)
    {   
        $key = 123456;
        $cipher = config('app.cipher');
        $data = base64_decode($request->input('license_key'));
        $iv = substr($data, 0, openssl_cipher_iv_length($cipher));
        $encrypted = substr($data, openssl_cipher_iv_length($cipher));
        $decrypted = openssl_decrypt($encrypted, $cipher, $key, 0, $iv);
        $decrypted = explode('&appK=', $decrypted);
        if (count($decrypted) === 1 && $decrypted[0] === "") {
            return 'Invalid QR';
        }
        $expiryDate = Carbon::createFromFormat('Y-m-d', $decrypted[0])->format('Y-m-d');
        if (getenv('APP_SERVER') == "BETA") {
            if (trim(shell_exec("lsblk -no SERIAL /dev/sda")) == "") {
                $instanceId = trim(shell_exec('curl -s http://169.254.169.254/latest/meta-data/instance-id'));
                $licenseKey = $decrypted[1];
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
                    if (getenv('APP_SYS') == "MG") {
                        $filename = '/'.'var/www/html/mary_grace/public/storage/check';
                    }
                    else if (getenv('APP_SYS') == "DD") {
                        $filename = '/'.'var/www/html/dd/public/storage/check';
                    }
                    $file = fopen($filename, 'w');
                    fwrite($file, Crypt::encrypt(Carbon::now()->format('Y-m-d')));
                    fclose($file);
                    return redirect()->route('login');
                } else {
                    // Invalid license key
                    return 'Invalid license key';
                }
            }
        }
        else{
            $interface = trim(shell_exec("ip -o link show | awk -F': ' '!/lo/{print $2; exit}'"));
            $macAddress = trim(shell_exec("ip -o link show $interface | awk '{print $17}'"));
            $serialNumber = trim(shell_exec("lsblk -no SERIAL /dev/sda"));
            // $expectedHash = '$2y$10$NPoAi/Yw7Vh6A/VKv8KZheIb5ocbME/ACkNr.8PUWMzId5r6c9DEO'; // Example hashed value
            $licenseKey = $decrypted[1];
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
                if (getenv('APP_SYS') == "MG") {
                    $filename = '/'.'var/www/html/mg/public/storage/check';
                }
                else if (getenv('APP_SYS') == "DD") {
                    $filename = '/'.'var/www/html/dunkin/public/storage/check';
                }
                $file = fopen($filename, 'w');
                fwrite($file, Crypt::encrypt(Carbon::now()->format('Y-m-d')));
                fclose($file);
                return redirect()->route('login');
            } else {
                // Invalid license key
                return 'Invalid license key';
            }
        }
    }
}
