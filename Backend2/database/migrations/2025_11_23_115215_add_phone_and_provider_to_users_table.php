<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users','phone')) {
                $table->string('phone')->nullable()->unique()->after('email');
                $table->timestamp('phone_verified_at')->nullable()->after('phone');
            }
            if (!Schema::hasColumn('users','provider')) {
                $table->string('provider')->nullable()->after('phone_verified_at');
                $table->string('provider_id')->nullable()->after('provider');
            }
            if (!Schema::hasColumn('users','name')) {
                $table->string('name')->nullable()->after('provider_id');
            }
        });
    }
    public function down() {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone','phone_verified_at','provider','provider_id','name']);
        });
    }
};

