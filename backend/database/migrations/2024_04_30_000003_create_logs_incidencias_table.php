<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('logs_incidencias', function (Blueprint $table) {
            $table->id('id_log');
            $table->foreignId('id_incidencia')->constrained('incidencias', 'id_incidencia');
            $table->foreignId('id_usuario')->constrained('usuarios', 'id_usuario');
            $table->string('accion');
            $table->text('descripcion');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('logs_incidencias');
    }
}; 