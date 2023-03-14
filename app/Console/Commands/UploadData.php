<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Imports\DataImport;
use Maatwebsite\Excel\Facades\Excel;

class UploadData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'upload:data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Upload data';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        Excel::import(new DataImport,public_path('storage/file_imports/temp/'.$queue->filename));
        return Command::SUCCESS;
    }
}
