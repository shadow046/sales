<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;
use Maatwebsite\Excel\Facades\Excel;

use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;
use App\Imports\CompanyImport;

use App\Models\Province;
use App\Models\Company;
use App\Models\CompanyContactPerson;


class CompanyController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function company()
    {
        $provinces = Province::orderBy('provDesc', 'asc')->get();
        return view('pages.company', compact('provinces'));
    }

    public function company_data()
    {
        return DataTables::of(Company::where('id','!=',0)->orderBy('company_name','ASC')->get())->make(true);
    }

    public function company_reload(){
        if(Company::count() == 0){
            return 'NULL';
        }
        $data_update = Company::latest('updated_at')->first()->updated_at;
        return $data_update;
    }

    public function company_contact_person_data(Request $request)
    {
        return DataTables::of(CompanyContactPerson::where('company_id',$request->id)->get())->make(true);
    }

    public function company_status(Request $request){
        if($request->status == 'ACTIVE'){
            $status1 = 'ACTIVE';
            $status2 = 'INACTIVE';
        }
        else{
            $status1 = 'INACTIVE';
            $status2 = 'ACTIVE';
        }
        $company_name = strtoupper($request->company_name);

        $company = Company::find($request->id);
        $company->status = $request->status;
        $sql = $company->save();

        if(!$sql){
            $result = 'false';
        }
        else {
            $result = 'true';

            $status = "【Status: FROM '$status2' TO '$status1'】";

            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "COMPANY STATUS UPDATED: User successfully updated status of $company_name with Company Code: $request->company_code with the following CHANGES: $status.";
            $userlogs->save();
        }
        return response($result);
    }

    public function saveCompany(Request $request){
        $company = new Company;
        $company->company_name = strtoupper($request->company_name);
        $company->company_code = strtoupper($request->company_code);
        $company->trade_name = ucwords($request->trade_name);
        $company->tax = $request->tax;
        $company->address = ucwords($request->address);
        $company->province = $request->province;
        $company->city = $request->city;
        $company->region = $request->region;
        $save = $company->save();

        if($save){
            $result = 'true';
            $id = $company->id;
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "ADDED COMPANY: User successfully added Company '$company->company_name' with Company Code '$company->company_code'.";
            $userlogs->save();
        }
        else{
            $result = 'false';
            $id = '';
        }

        $data = array('result' => $result, 'id' => $id);
        return response()->json($data);
    }

    public function editCompany(Request $request){
        $company_code_orig = Company::where('id',$request->id)->first()->company_code;
        $company_name_orig = Company::where('id',$request->id)->first()->company_name;
        $trade_name_orig = Company::where('id',$request->id)->first()->trade_name;
        $tax_orig = Company::where('id',$request->id)->first()->tax;
        $address_orig = Company::where('id',$request->id)->first()->address;
        $province_orig = Company::where('id',$request->id)->first()->province;
        $city_orig = Company::where('id',$request->id)->first()->city;
        $region_orig = Company::where('id',$request->id)->first()->region;

        if(strtoupper($request->company_code) !=  $company_code_orig){
            $company_code_new = strtoupper($request->company_code);
            $company_code = "【Company Code: FROM '$company_code_orig' TO '$company_code_new'】";
        }
        else{
            $company_code = NULL;
        }

        if(strtoupper($request->company_name) !=  $company_name_orig){
            $company_name_new = strtoupper($request->company_name);
            $company_name = "【Company Name: FROM '$company_name_orig' TO '$company_name_new'】";
        }
        else{
            $company_name = NULL;
        }

        if(ucwords($request->trade_name) !=  $trade_name_orig){
            $trade_name_new = strtoupper($request->trade_name);
            $trade_name = "【Trade Name: FROM '$trade_name_orig' TO '$trade_name_new'】";
        }
        else{
            $trade_name = NULL;
        }

        if($request->tax !=  $tax_orig){
            $tax = "【Tax: FROM '$tax_orig' TO '$request->tax'】";
        }
        else{
            $tax = NULL;
        }

        if(ucwords($request->address) !=  $address_orig){
            $address_new = strtoupper($request->address_orig);
            $address = "【Address: FROM '$address_orig' TO '$address_new'】";
        }
        else{
            $address = NULL;
        }

        if($request->province !=  $province_orig){
            $province = "【Province: FROM '$province_orig' TO '$request->province'】";
        }
        else{
            $province = NULL;
        }

        if($request->city !=  $city_orig){
            $city = "【City: FROM '$city_orig' TO '$request->city'】";
        }
        else{
            $city = NULL;
        }

        if($request->region !=  $region_orig){
            $region = "【Region: FROM '$region_orig' TO '$request->region'】";
        }
        else{
            $region = NULL;
        }

        if($request->contact_person_change ==  'CHANGED'){
            $contact_person = "【Contact Person: List of Contact Person/s have been changed】";
        }
        else if($request->contact_person_change ==  'DELETED'){
            $contact_person = "【Contact Person: List of Contact Person/s have been deleted】";
        }
        else{
            $contact_person = NULL;
        }

        $company = Company::find($request->id);
        $company->company_code = strtoupper($request->company_code);
        $company->company_name = strtoupper($request->company_name);
        $company->trade_name = ucwords($request->trade_name);
        $company->tax = $request->tax;
        $company->address = ucwords($request->address);
        $company->province = $request->province;
        $company->city = $request->city;
        $company->region = $request->region;
        $save = $company->save();

        if($save){
            $result = 'true';
            $id = $company->id;
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "UPDATED COMPANY: User successfully updated Company '$company->company_name' with Company Code '$company->company_code' with the following CHANGES: $company_code $company_name $trade_name $tax $address $province $city $region $contact_person";
            $userlogs->save();
        }
        else{
            $result = 'false';
            $id = '';
        }

        $data = array('result' => $result, 'id' => $id);
        return response()->json($data);
    }

    public function saveCompanyContactPerson(Request $request){
        $companyContactPerson = new CompanyContactPerson;
        $companyContactPerson->company_id = $request->company_id;
        $companyContactPerson->person = ucwords($request->person);
        $companyContactPerson->position = $request->position;
        $companyContactPerson->email_address = $request->email_address;
        $companyContactPerson->telephone = $request->telephone;
        $companyContactPerson->mobile = $request->mobile;
        $companyContactPerson->save();
    }

    public function company_contact_person_delete(Request $request){
        $company_id = explode(",",$request->id);
        foreach($company_id as $id){
            CompanyContactPerson::where('id', $id)->delete();
        }
    }

    public function checkDuplicate(Request $request){
        if(Company::where('company_code', $request->company_code)->count() > 0){
            return 'duplicate_company_code';
        }

        if(Company::where('company_name', $request->company_name)->count() > 0){
            return 'duplicate_company_name';
        }
    }

    public function import(Request $request){
        $file = $request->file('xlsx');
        $import = new CompanyImport;
        $data = Excel::toArray($import, $file);
        if(count($data[0]) == 0){
            return redirect()->to('/company?import=failed');
        }
        $failed_rows = [];
        $row_num = 2;
        foreach($data[0] as $key => $value){
            if(!$value['company_code'] && !$value['company_name'] && !$value['trade_name'] && !$value['tax'] && !$value['address'] && !$value['person'] && !$value['position'] && !$value['email_address'] && !$value['telephone'] && !$value['mobile']){
                echo(null);
            }
            else if(!$value['company_code'] || !$value['company_name'] || !$value['trade_name'] || !$value['tax'] || !$value['address'] || !$value['person'] || !$value['position'] || !$value['email_address'] || !$value['telephone'] || !$value['mobile']){
                array_push($failed_rows, '[Row: '.$row_num.' => Error: Fill Required Fields!]');
            }
            else{
                $company_code = strtoupper(trim($value['company_code']));
                if(!Company::where('company_code', $company_code)->first()){
                    $company = new Company;
                    $company->company_code = $company_code;
                    $company->company_name = strtoupper($value['company_name']);
                    $company->trade_name = ucwords($value['trade_name']);
                    $company->tax = $value['tax'];
                    $company->address = ucwords($value['address']);
                    $sql = $company->save();
                    $id = $company->id;

                    $companyContactPerson = new CompanyContactPerson;
                    $companyContactPerson->company_id = $company->id;
                    $companyContactPerson->person = ucwords($value['person']);
                    $companyContactPerson->position = ucwords($value['position']);
                    $companyContactPerson->email_address = strtolower($value['email_address']);
                    $companyContactPerson->telephone = $value['telephone'];
                    $companyContactPerson->mobile = $value['mobile'];
                    $companyContactPerson->save();

                    if(!$sql){
                        array_push($failed_rows, '[Row: '.$row_num.', Error: Save Failed!]');
                    }
                    else{
                        $userlogs = new UserLogs;
                        $userlogs->user_id = auth()->user()->id;
                        $userlogs->activity = "ADDED COMPANY: User successfully added Company '$company->company_name'.";
                        $userlogs->save();
                    }
                }
                else{
                    $company_id = Company::where('company_code', $company_code)->first()->id;
                    $company = Company::find($company_id);
                    $company->company_code = $company_code;
                    $company->company_name = strtoupper($value['company_name']);
                    $company->trade_name = ucwords($value['trade_name']);
                    $company->tax = $value['tax'];
                    $company->address = ucwords($value['address']);
                    $sql = $company->save();
                    $id = $company->id;

                    CompanyContactPerson::where('company_id', $company_id)->delete();
                    $companyContactPerson = new CompanyContactPerson;
                    $companyContactPerson->company_id = $company_id;
                    $companyContactPerson->person = ucwords($value['person']);
                    $companyContactPerson->position = ucwords($value['position']);
                    $companyContactPerson->email_address = strtolower($value['email_address']);
                    $companyContactPerson->telephone = $value['telephone'];
                    $companyContactPerson->mobile = $value['mobile'];
                    $companyContactPerson->save();

                    if(!$sql){
                        array_push($failed_rows, '[Row: '.$row_num.', Error: Update Failed!]');
                    }
                    else{
                        $userlogs = new UserLogs;
                        $userlogs->user_id = auth()->user()->id;
                        $userlogs->activity = "UPDATED COMPANY: User successfully updated Company '$company->company_name'.";
                        $userlogs->save();
                    }
                }

            }
            $row_num++;
        }
        if(count($failed_rows) == count($data[0])){
            $errors = implode(', ', $failed_rows);
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "COMPANY FILE IMPORT [FAILED]: User attempt failed to import file data into Company with the following errors: $errors.";
            $userlogs->save();

            return redirect()->to('/company?import=failed');
        }
        else if(count($failed_rows) == 0){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "COMPANY FILE IMPORT [NO ERRORS]: User successfully imported file data into Company without any errors.";
            $userlogs->save();

            return redirect()->to('/company?import=success_without_errors');
        }
        else{
            $errors = implode(', ', $failed_rows);
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "COMPANY FILE IMPORT [WITH ERRORS]: User successfully imported file data into Company with the following errors: $errors.";
            $userlogs->save();

            return redirect()->to('/company?import=success_with_errors');
        }
    }
}
