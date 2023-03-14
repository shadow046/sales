<?php

namespace App\Imports;

use App\Models\Data;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class DataImport implements ToModel, WithStartRow, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function startRow(): int
    {
        return 2;
    }

    public function model(array $row)
    {
        return new Data([
            'storecode' => $row['storecode'],
            'tid' => $row['tid'],
            'tnumber' => $row['tnumber'],
            'seq' => $row['seq'],
            'trantype' => $row['trantype'],
            'itemcat' => $row['itemcat'],
            'itemcode' => $row['itemcode'],
            'desc1' => $row['desc1'],
            'desc2' => $row['desc2'],
            'unitprice' => $row['unitprice'],
            'qty' => $row['qty'],
            'vatable' => $row['vatable'],
            'zerorated' => $row['zerorated'],
            'discname' => $row['discname'],
            'vezrname' => $row['vezrname'],
            'shift' => $row['shift'],
            'cashier' => $row['cashier'],
            'tdate' => $row['tdate'],
            'ttime' => $row['ttime']
        ]);
    }
}
