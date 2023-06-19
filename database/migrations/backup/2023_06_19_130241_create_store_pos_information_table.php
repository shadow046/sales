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
        Schema::create('store_pos_information', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('store_id')->default('0');
            $table->string('model')->nullable();
            $table->string('serial')->nullable();
            $table->string('min')->nullable();
            $table->string('ptu')->nullable();
            $table->string('date_issued')->nullable();
            $table->string('status')->default('ACTIVE');
            $table->string('remarks')->nullable();
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
        Schema::dropIfExists('store_pos_information');
    }
};
