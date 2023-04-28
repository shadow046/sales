<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Middleware\CheckUserLevel;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DeliveryServingStoreController;
use App\Http\Controllers\GenerateReportsController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NetworkSetupController;
use App\Http\Controllers\POSController;
use App\Http\Controllers\PriceUpdateController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\PromosController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\SalesTypeController;
use App\Http\Controllers\SetupController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\SubGroupController;
use App\Http\Controllers\TypeController;
use App\Http\Controllers\TenderTypeController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StoreAreaController;
use App\Http\Controllers\TransactionTypeController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\PdfController;

Auth::routes(['register' => false, 'verify' => false, 'confirm' => false]);
Route::fallback(function(){return redirect("/login");});
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::get('/logout', [LoginController::class, 'logout'])->name('logout');

Route::controller(CategoryController::class)->group(function(){
    Route::any('/maintenance-category','category');
    Route::any('/category_data','category_data');
    Route::any('/category_reload','category_reload');
    Route::any('/categoryCombo','categoryCombo');
    Route::any('/saveCategory','saveCategory');
    Route::any('/editCategory','editCategory');
    Route::any('/deleteCategory','deleteCategory');
    Route::any('/category/checkDuplicate','checkDuplicate');
});

Route::controller(CompanyController::class)->group(function(){
    Route::get('/company', 'company');
    Route::get('/company_data', 'company_data');
    Route::get('/company_reload', 'company_reload');
    Route::get('/company_contact_person/data', 'company_contact_person_data');
    Route::any('/saveCompany','saveCompany');
    Route::any('/editCompany','editCompany');
    Route::any('/saveCompanyContactPerson','saveCompanyContactPerson');
    Route::any('/company_contact_person/delete', 'company_contact_person_delete');
    Route::any('/company/import','import');
    Route::any('/company_code/checkDuplicate', 'checkDuplicate');
    Route::any('/company_name/checkDuplicate', 'checkDuplicate');
    Route::any('/company_status', 'company_status');
});

Route::controller(DeliveryServingStoreController::class)->group(function(){
    Route::any('/maintenance-delivery-channel','delivery_serving_store');
    Route::any('/delivery_serving_store_data','delivery_serving_store_data');
    Route::any('/serving_store_reload','serving_store_reload');
    Route::any('/saveDeliveryServingStore','saveDeliveryServingStore');
    Route::any('/editDeliveryServingStore','editDeliveryServingStore');
    Route::any('/deleteDeliveryServingStore','deleteDeliveryServingStore');
    Route::any('/delivery_serving_store/checkDuplicate','checkDuplicate');
});

Route::controller(GenerateReportsController::class)->group(function(){
    Route::get('/sales/reports','reports');
    Route::get('/sales/reports/branch','byBranch');
    Route::get('/sales/reports/branch/date','byBranch_Date');
    Route::get('/sales/reports/branch/product','byBranch_Product');
    Route::get('/sales/reports/product','byProduct');
    Route::get('/sales/reports/product/date','byProduct_Date');
    Route::get('/sales/reports/product/branch','byProduct_Branch');
    Route::get('/sales/reports/combo','byCombo');
    Route::get('/sales/reports/combo/date','byCombo_Date');
    Route::get('/sales/reports/combo/branch','byCombo_Branch');
    Route::get('/sales/reports/transaction','byTransaction');
    Route::get('/sales/reports/transaction/date','byTransaction_Date');
    Route::get('/sales/reports/transaction/branch','byTransaction_Branch');
});

Route::controller(GroupController::class)->group(function(){
    Route::any('/maintenance-group','group');
    Route::get('/group_reload', 'group_reload');
    Route::any('/group_data','group_data');
    Route::any('/saveGroup','saveGroup');
    Route::any('/editGroup','editGroup');
    Route::any('/deleteGroup','deleteGroup');
    Route::any('/group/checkDuplicate','checkDuplicate');
});

Route::controller(HomeController::class)->group(function(){
    Route::get('/', 'index');
    Route::get('/logs', 'logs');
    Route::get('/index/data', 'index_data');
    Route::get('/index/logs/reload', 'logs_reload');
    Route::get('/getCities', 'getCities');
    Route::get('/getRegion', 'getRegion');
});

Route::controller(NetworkSetupController::class)->group(function(){
    Route::any('/maintenance-network-setup','network_setup');
    Route::any('/network_setup_data','network_setup_data');
    Route::any('/network_setup_reload','network_setup_reload');
    Route::any('/saveNetworkSetup','saveNetworkSetup');
    Route::any('/editNetworkSetup','editNetworkSetup');
    Route::any('/deleteNetworkSetup','deleteNetworkSetup');
    Route::any('/network_setup/checkDuplicate','checkDuplicate');
});

Route::controller(POSController::class)->group(function(){
    Route::get('/maintenance-pos', 'pos');
    Route::get('/pos_data', 'pos_data');
    Route::get('/pos_reload', 'pos_reload');
    Route::get('/pos_specification/data', 'pos_specification_data');
    Route::any('/savePos','savePos');
    Route::any('/editPos','editPos');
    Route::any('/deletePos','deletePos');
    Route::any('/savePosSpecification','savePosSpecification');
    Route::any('/syncPosSpecification','syncPosSpecification');
    Route::any('/pos_specification/delete', 'pos_specification_delete');
    Route::any('/model/checkDuplicate','checkDuplicate');
});

Route::controller(PriceUpdateController::class)->group(function(){
    Route::get('/price_update', 'price_update');
    Route::get('/price_update_data','price_update_data');
    Route::any('/savePriceUpdate','savePriceUpdate');
    Route::any('/editPriceUpdate','editPriceUpdate');
    Route::any('/deletePriceUpdate','deletePriceUpdate');
    Route::any('/sendPriceUpdate','sendPriceUpdate');
    Route::any('/fetchCurrentPrices','fetchCurrentPrices');
});

Route::controller(ProductsController::class)->group(function(){
    Route::get('/products', 'products');
    Route::get('/products_data', 'products_data');
    Route::get('/products_reload', 'products_reload');
    Route::any('/products_status', 'products_status');
    Route::any('/products/save','products_save');
    Route::any('/products/update','products_update');
    Route::any('/products/insertImage','insertImage');
    Route::any('/products/import','import');
    Route::any('/products/stores','products_stores');
    Route::any('/item_code/checkDuplicate','checkDuplicate');
    Route::any('/sku/checkDuplicate','checkDuplicate');
    Route::any('/modifier_code/checkDuplicate','checkDuplicate');
    Route::any('/products/import', 'import');
    Route::any('/sendProductUpdate','sendProductUpdate');
});

Route::controller(PromosController::class)->group(function(){
    Route::get('/promos', 'promos');
    Route::get('/promo_data', 'promo_data');
    Route::get('/promo_reload', 'promo_reload');
    Route::get('/promo_product_combination/data', 'promo_product_combination_data');
    Route::get('/setShortDescription','setShortDescription');
    Route::any('/savePromo','savePromo');
    Route::any('/editPromo','editPromo');
    Route::any('/savePromoProductCombination','savePromoProductCombination');
    Route::any('/promo_product_combination/delete', 'promo_product_combination_delete');
    Route::any('/promo_product_combination/bulk_delete', 'promo_product_combination_bulk_delete');
    Route::any('/promo_code/checkDuplicate','checkDuplicate');

});

Route::controller(ReportsController::class)->group(function(){
    Route::get('/reports','reports');
    Route::get('/reports/branch','byBranch');
    Route::get('/reports/area','byArea');
    Route::get('/reports/region','byRegion');
    Route::get('/reports/area_manager','byAreaManager');
    Route::get('/reports/group','byGroup');
    Route::get('/reports/setup','bySetup');
    Route::get('/reports/delivery','byDelivery');
    Route::get('/reports/transaction','byTransaction');
    Route::get('/reports/tender','byTender');
    Route::get('/reports/discount','byDiscount');
    Route::get('/reports/product','byProduct');
    Route::get('/reports/combo','byCombo');
    Route::get('/subreports/area_manager','subAreaManager');
});

Route::controller(RoleController::class)->group(function(){
    Route::get('/roles','roles');
    Route::get('/roles_reload', 'roles_reload');
    Route::get('/roles_data','roles_data');
    Route::any('/saveRole','saveRole');
    Route::any('/editRole','editRole');
    Route::any('/deleteRole','deleteRole');
    Route::get('/roles/users','users');
    Route::get('/roles/permissions','permissions');
    Route::get('/roles/checkDuplicate','checkDuplicate');
});

Route::controller(SalesController::class)->group(function(){
    Route::get('/sales/index', 'sales');
    Route::get('/sales-data', 'data');
    Route::get('/sales/daily', 'daily');
    Route::get('/sales/monthly', 'monthly');
    Route::get('/sales/dine-in', 'dine_in');
    Route::get('/sales/transaction', 'transaction');
    Route::get('/sales/take-out', 'take_out');
    Route::get('/sales/drive-thru', 'drive_thru');
    Route::get('/sales/cash', 'cash');
    Route::get('/sales/gcash', 'gcash');
    Route::get('/sales/debit', 'debit');
    Route::get('/sales/maya', 'maya');
    Route::get('/sales/daily_data', 'daily_data');
    Route::get('/sales/category_data', 'category_data');
    Route::get('/sales/pie_data', 'pie_data');
    Route::get('/sales/daily_data', 'daily_data');
    Route::get('/sales/tender_data', 'tender_data');
    Route::get('/sales/tender_pie_data', 'tender_pie_data');
    Route::get('/sales/discount_data', 'discount_data');
    Route::get('/sales/barchart', 'barchart');
    // Route::get('/sales/company_data', 'company_data');
});

Route::controller(SalesTypeController::class)->group(function(){
    Route::any('/maintenance-sales-type','sales_type');
    Route::any('/sales_type_data','sales_type_data');
    Route::any('/sales_type_reload','sales_type_reload');
    Route::any('/saveSalesType','saveSalesType');
    Route::any('/editSalesType','editSalesType');
    Route::any('/deleteSalesType','deleteSalesType');
    Route::any('/sales_type/checkDuplicate','checkDuplicate');
});

Route::controller(SetupController::class)->group(function(){
    Route::any('/setup_data','setup_data');
    Route::get('/setup_reload', 'setup_reload');
    Route::any('/maintenance-setup','setup');
    Route::any('/saveSetup','saveSetup');
    Route::any('/editSetup','editSetup');
    Route::any('/deleteSetup','deleteSetup');
    Route::any('/setup/checkDuplicate','checkDuplicate');
});

Route::controller(StoreController::class)->group(function(){
    Route::get('/store', 'store');
    Route::get('/store_data', 'store_data');
    Route::get('/store_reload', 'store_reload');
    Route::any('/store_status', 'store_status');
    Route::get('/store_contact_details/data', 'store_contact_details_data');
    Route::get('/store_pos_information/data', 'store_pos_information_data');
    Route::any('/saveStore','saveStore');
    Route::any('/editStore','editStore');
    Route::any('/saveStoreContactDetails','saveStoreContactDetails');
    Route::any('/saveStorePosInformation','saveStorePosInformation');
    Route::any('/StoreContactDetails/delete','StoreContactDetails_delete');
    Route::any('/StorePosInformation/delete','StorePosInformation_delete');
    Route::any('/store/import','import');
    Route::any('/branch_code/checkDuplicate', 'checkDuplicate');
    Route::any('/branch_name/checkDuplicate', 'checkDuplicate');
    Route::any('/tin/checkDuplicate', 'checkDuplicate');
    Route::any('/contact_person/checkDuplicate', 'checkDuplicate');
    Route::any('/email/checkDuplicate', 'checkDuplicate');
    Route::any('/telephone/checkDuplicate', 'checkDuplicate');
    Route::any('/mobile/checkDuplicate', 'checkDuplicate');
    Route::any('/ptu/checkDuplicate_Pos', 'checkDuplicate_Pos');
    Route::any('/min/checkDuplicate_Pos', 'checkDuplicate_Pos');
    Route::any('/editStoreContactDetails', 'editStoreContactDetails');
    Route::any('/editStorePosInformation', 'editStorePosInformation');
});

Route::controller(StoreAreaController::class)->group(function(){
    Route::any('/maintenance-store-area','store_area');
    Route::any('/store_area_data','store_area_data');
    Route::any('/saveStoreArea','saveStoreArea');
    Route::any('/editStoreArea','editStoreArea');
    Route::any('/deleteStoreArea','deleteStoreArea');
    Route::any('/store_area_reload','store_area_reload');
    Route::any('/store_area/checkDuplicate','checkDuplicate');
});

Route::controller(SubGroupController::class)->group(function(){
    Route::any('/maintenance-sub-group','subgroup');
    Route::any('/subgroup_data','subgroup_data');
    Route::any('/subgroup_reload','subgroup_reload');
    Route::any('/saveSubgroup','saveSubgroup');
    Route::any('/editSubgroup','editSubgroup');
    Route::any('/deleteSubGroup','deleteSubGroup');
    Route::any('/subgroup/checkDuplicate','checkDuplicate');
});

Route::controller(TypeController::class)->group(function(){
    Route::any('/type_data','type_data');
    Route::get('/type_reload', 'type_reload');
    Route::any('/maintenance-type','type');
    Route::any('/saveType','saveType');
    Route::any('/editType','editType');
    Route::any('/deleteType','deleteType');
    Route::any('/type/checkDuplicate','checkDuplicate');
});

Route::controller(TenderTypeController::class)->group(function(){
    Route::any('/tender_type_data','tender_type_data');
    Route::get('/tender_type_reload', 'tender_type_reload');
    Route::any('/maintenance-tender-type','tender_type');
    Route::any('/saveTenderType','saveTenderType');
    Route::any('/editTenderType','editTenderType');
    Route::any('/deleteTenderType','deleteTenderType');
    Route::any('/tender_type/checkDuplicate','checkDuplicate');
});

Route::controller(TransactionTypeController::class)->group(function(){
    Route::any('/transaction_type_data','transaction_type_data');
    Route::get('/transaction_type_reload','transaction_type_reload');
    Route::any('/maintenance-transaction-type','transaction_type');
    Route::any('/saveTransactionType','saveTransactionType');
    Route::any('/editTransactionType','editTransactionType');
    Route::any('/deleteTransactionType','deleteTransactionType');
    Route::any('/transaction_type/checkDuplicate','checkDuplicate');
});

Route::controller(DiscountController::class)->group(function(){
    Route::any('/discount_data','discount_data');
    Route::get('/discount_reload','discount_reload');
    Route::any('/maintenance-discount','discount');
    Route::any('/saveDiscount','saveDiscount');
    Route::any('/editDiscount','editDiscount');
    Route::any('/deleteDiscount','deleteDiscount');
    Route::any('/discount/checkDuplicate','checkDuplicate');
});

Route::controller(PdfController::class)->group(function(){
    Route::any('sales/uploads','pdf');
    Route::any('/pdf_data','pdf_data');
});

Route::controller(UploadController::class)->group(function(){
    Route::any('data-import', 'import')->name('data.import');
});

Route::controller(UserController::class)->group(function(){
    Route::get('/users', 'users');
    Route::get('/users/data', 'users_data');
    Route::get('/users/reload', 'users_reload');
    Route::any('/users/validate/save', 'validate_users_save');
    Route::any('/users/save', 'users_save');
    Route::any('/users/validate/update', 'validate_users_update');
    Route::any('/users/update', 'users_update');
    Route::any('/users/status', 'users_status');
    Route::get('/users/permissions', 'users_permissions');
    Route::get('/users/stores', 'users_stores');
    Route::get('/users/areas', 'users_areas');
    Route::any('/change/validate', 'change_validate');
    Route::any('/change/password', 'change_password');
});

Route::get('/txt-to-pdf', function () {
    // $txtFile = storage_path('uploads/G228-20230101-AIEJ-1.txt');
    // $pdfFile = storage_path('uploads/example.pdf');
    $txtFile = public_path('storage/uploads/G228-20230101-AIEJ-1.txt');
    $pdfFile = public_path('storage/uploads/example.pdf');
    // SnappyPdf::loadFile($txtFile)
    //         ->save($pdfFile);

    // return response()->download($pdfFile);
    $pdf = SnappyPdf::loadFile($txtFile)->output();

    // Set the response headers
    $headers = [
        'Content-Type' => 'application/pdf',
        'Content-Disposition' => 'inline; filename="example.pdf"',
    ];

    // Return the PDF as a response
    return response($pdf, 200, $headers);
});