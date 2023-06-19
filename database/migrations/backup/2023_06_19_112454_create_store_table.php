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
        Schema::create('store', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('branch_code')->nullable();
            $table->string('company_name')->nullable();
            $table->string('tin')->nullable();
            $table->string('branch_name')->nullable();
            $table->string('address')->nullable();
            $table->string('store_area')->nullable();
            $table->string('province')->nullable();
            $table->string('city')->nullable();
            $table->string('region')->nullable();
            $table->string('type')->nullable();
            $table->string('setup')->nullable();
            $table->string('group')->nullable();
            $table->string('sub_group')->default('0');
            $table->string('network')->nullable();
            $table->string('serving_store')->nullable();
            $table->string('status')->default('ACTIVE');
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
        Schema::dropIfExists('store');
    }
};
