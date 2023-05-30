<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Zxing\QrReader;

class QRCodeController extends Controller
{
    public function index()
    {
        return view('qrcode.decode');
    }

    public function decode(Request $request)
    {
        $image = $request->file('file');

        // Get the file path
        $imagePath = $image->getPathname();

        // Create a QR code reader instance
        $qrcode = new QrReader($imagePath);
        $qrReader = new QrReader($imagePath);

        // Decode the QR code
        $decodedData = $qrReader->text();

        // Return the decoded data as JSON response
        return response()->json(['decodedData' => $decodedData]);
    }
}
