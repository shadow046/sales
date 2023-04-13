<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PdfController extends Controller
{
    public function pdf(){
        return view('pages.pdf_reports');
    }
}
