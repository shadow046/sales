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
        Schema::create('sendupdate', function (Blueprint $table) {
            $table->string('date');
            $table->string('type');
            $table->integer('seqno');
            $table->unique(['date', 'type', 'seqno'], 'unique_date_type_seqno');
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
        Schema::dropIfExists('sendupdate');
    }
};
