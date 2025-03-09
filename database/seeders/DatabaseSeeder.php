<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

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
            'view_users',
            'create_users',
            'edit_users',
            'delete_users',
            'force-delete_users',
            'restore_users',

            'view_roles',
            'create_roles',
            'edit_roles',
            'delete_roles',
            'force-delete_roles',
            'restore_roles',

            'view_permissions',
            'create_permissions',
            'edit_permissions',
            'delete_permissions',
            'force-delete_permissions',
            'restore_permissions',
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
        $editorRole->syncPermissions(['view_users', 'create_users', 'edit_users']);

        $user = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            ['name' => 'Admin User', 'password' => bcrypt('12341234')]
        );

        // Gán role admin cho user
        $user->assignRole($adminRole);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@gmail.com',
        ]);
    }
}
