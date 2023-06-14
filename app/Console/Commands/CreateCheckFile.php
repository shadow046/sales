<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Crypt;
use Carbon\Carbon;

class CreateCheckFile extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'Create:File';

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
        if(getenv('APP_SERVER') == 'LOCAL'){
            $filePath = '/var/www/html/dunkin/public/storage/check';
            $file = fopen($filePath, 'w');
            fwrite($file, Crypt::encrypt(Carbon::now()->format('Y-m-d')));
            fclose($file);
            $filePath = '/var/www/html/mg/public/storage/check';
            $file = fopen($filePath, 'w');
            fwrite($file, Crypt::encrypt(Carbon::now()->format('Y-m-d')));
            fclose($file);
            return Command::SUCCESS;
        }
        else{
            $filePath = '/var/www/html/dd/public/storage/check';
            $file = fopen($filePath, 'w');
            fwrite($file, Crypt::encrypt(Carbon::now()->format('Y-m-d')));
            fclose($file);
            $filePath = '/var/www/html/mary_grace/public/storage/check';
            $file = fopen($filePath, 'w');
            fwrite($file, Crypt::encrypt(Carbon::now()->format('Y-m-d')));
            fclose($file);
            return Command::SUCCESS;
        }
    }
}
