<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {

        if (!Schema::hasTable('orders')) {
        return;
    }
        Schema::table('orders', function (Blueprint $table) {
            // make user_id nullable
            if (Schema::hasColumn('orders','user_id')) {
                $table->unsignedBigInteger('user_id')->nullable()->change();
            } else {
                $table->unsignedBigInteger('user_id')->nullable();
            }
            if (!Schema::hasColumn('orders','guest_token')) {
                $table->string('guest_token')->nullable()->index()->after('user_id');
            }
            if (!Schema::hasColumn('orders','guest_phone')) {
                $table->string('guest_phone')->nullable()->index()->after('guest_token');
            }
        });
    }
    

    public function down() {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders','guest_phone')) $table->dropColumn('guest_phone');
            if (Schema::hasColumn('orders','guest_token')) $table->dropColumn('guest_token');
            // note: don't change user_id back automatically
        });
    }
};
