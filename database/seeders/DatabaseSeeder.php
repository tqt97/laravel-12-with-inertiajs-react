<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        // Danh sách permission mẫu
        $permissions = [
            'view users',
            'create users',
            'edit users',
            'delete users',
            'view users',
            'create users',
            'edit users',
            'delete users',
            'force-delete users',
            'restore users',
        ];

        // Tạo hoặc lấy lại các permission
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Tạo role 'admin' và gán tất cả permission
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions($permissions);

        // Tạo role 'editor' với các permission hạn chế
        $editorRole = Role::firstOrCreate(['name' => 'editor']);
        $editorRole->syncPermissions(['view users', 'create users', 'edit users']);

        $user = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            ['name' => 'Admin User', 'password' => bcrypt('password')]
        );

        // Gán role admin cho user
        $user->assignRole($adminRole);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@gmail.com',
        ]);
    }
}
