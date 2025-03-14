<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Permission;
use App\Repositories\Permission\PermissionRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class PermissionService
{
    public function __construct(protected PermissionRepositoryInterface $repository) {}

    /**
     * Retrieves all permissions from the repository.
     *
     * @return array A array of all permissions.
     */
    public function getAllPermissions(): array
    {
        return $this->repository->getAllWithColumns(['id', 'name', 'is_custom'])->toArray();
    }

    /**
     * Creates a new permission and returns it.
     *
     * @param  array  $data  The data to create the permission with.
     * @return Permission The newly created permission.
     *
     * @throws Throwable If an error occurs while creating the permission.
     */
    public function create(array $data): Permission
    {
        try {
            return DB::transaction(fn () => $this->repository->create($data));
        } catch (Throwable $e) {
            Log::error('Error creating permission: '.$e->getMessage());
            throw new Exception('Something went wrong !');
        }
    }

    /**
     * Updates a permission with the given data.
     *
     * @param  Permission  $permission  The permission object to update.
     * @param  array  $data  The data to update the permission with.
     * @return bool true if the permission was updated successfully, false if not.
     *
     * @throws Throwable If an error occurs while updating the permission.
     */
    public function update(Permission $permission, array $data): bool
    {
        try {
            return DB::transaction(fn () => $this->repository->update($permission, $data));
        } catch (Throwable $e) {
            Log::error('Error updating permission: '.$e->getMessage(), ['data' => $data]);
            throw new Exception('Something went wrong !');
        }
    }

    /**
     * Deletes a permission.
     *
     * @param  Permission  $permission  The permission to delete.
     * @return bool true if the permission was deleted successfully, false if not.
     *
     * @throws Throwable If an error occurs while deleting the permission.
     */
    public function delete(Permission $permission): bool
    {
        try {
            return DB::transaction(fn () => $this->repository->delete($permission));
        } catch (Throwable $e) {
            Log::error('Error deleted permission: '.$e->getMessage());
            throw new Exception('Something went wrong !');
        }

    }
}
