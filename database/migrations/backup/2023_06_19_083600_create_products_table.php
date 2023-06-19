<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('item_code')->nullable();
            $table->string('category')->nullable();
            $table->string('intro_date')->nullable();
            $table->string('short_desc')->nullable();
            $table->string('long_desc')->nullable();
            $table->string('sku')->nullable();
            $table->string('modifier_code')->nullable();
            $table->string('company')->nullable();
            $table->string('type')->nullable();
            $table->string('setup')->nullable();
            $table->string('area')->nullable();
            $table->string('store')->nullable();
            $table->string('store_code')->nullable();
            $table->string('status')->default('ACTIVE');
            $table->string('dine_in')->default('0.00');
            $table->string('take_out')->default('0.00');
            $table->string('pick_up')->default('0.00');
            $table->string('delivery')->default('0.00');
            $table->string('bulk_order')->default('0.00');
            $table->string('fds')->default('0.00');
            $table->string('drive_thru')->default('0.00');
            $table->string('meal_type')->default('0.00');
            $table->string('dine_in_airport')->default('0.00');
            $table->string('take_out_airport')->default('0.00');
            $table->string('pick_up_airport')->default('0.00');
            $table->string('delivery_airport')->default('0.00');
            $table->string('bulk_order_airport')->default('0.00');
            $table->string('meal_type_aiport')->default('0.00');
            $table->string('senior')->default('0.00');
            $table->string('pwd')->default('0.00');
            $table->string('pos_setup')->nullable();
            $table->string('max_modifier')->default('0');
            $table->string('seq')->nullable();
            $table->string('kitchen_printer')->default('0');
            $table->string('promo_start')->nullable();
            $table->string('promo_end')->nullable();
            $table->string('promo_price')->nullable();
            $table->string('promo_item_not_allow')->nullable();
            $table->string('sales_type')->nullable();
            $table->string('promo_setup')->nullable();
            $table->string('start_date')->nullable();
            $table->string('start_time')->nullable();
            $table->string('end_date')->nullable();
            $table->string('end_time')->nullable();
            $table->string('days_available')->nullable();
            $table->string('dine_sml')->nullable();
            $table->string('dine_med')->nullable();
            $table->string('dine_large')->nullable();
            $table->string('dine_xl')->nullable();
            $table->string('dine_zero')->nullable();
            $table->string('take_out_sml')->nullable();
            $table->string('take_out_med')->nullable();
            $table->string('take_out_large')->nullable();
            $table->string('take_out_xl')->nullable();
            $table->string('take_out_zero')->nullable();
            $table->string('pickup_sml')->nullable();
            $table->string('pickup_med')->nullable();
            $table->string('pickup_large')->nullable();
            $table->string('pickup_xl')->nullable();
            $table->string('pickup_zero')->nullable();
            $table->string('delivery_sml')->nullable();
            $table->string('delivery_med')->nullable();
            $table->string('delivery_large')->nullable();
            $table->string('delivery_xl')->nullable();
            $table->string('delivery_zero')->nullable();
            $table->string('product_image')->nullable();
            $table->string('product_update_status')->default('0');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
