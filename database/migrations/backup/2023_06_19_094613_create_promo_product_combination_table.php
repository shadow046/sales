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
        Schema::create('promo_product_combination', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('promo_id')->default('0');
            $table->string('product_id')->default('0');
            $table->string('qty')->default('1');
            $table->string('promo_item_status')->default('ACTIVE');
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
        Schema::dropIfExists('promo_product_combination');
    }
};
