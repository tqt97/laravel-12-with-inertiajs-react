<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Permission\StorePermissionRequest;
use App\Http\Requests\Admin\Permission\UpdatePermissionRequest;
use App\Models\Permission;
use App\Services\PermissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class PermissionController extends Controller implements HasMiddleware
{
    public function __construct(protected PermissionService $permissionService) {}

    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('check.policy:viewAny,App\Models\Permission', only: ['index']),
            new Middleware('check.policy:view,App\Models\Permission', only: ['show']),
            new Middleware('check.policy:create,App\Models\Permission', only: ['store']),
            new Middleware('check.policy:update,App\Models\Permission', only: ['update']),
            new Middleware('check.policy:delete,App\Models\Permission', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     *
     * Retrieves all permissions from the repository and passes them to the view.
     *
     * @return Response The rendered Inertia view with the permissions as props.
     */
    public function index(): Response
    {
        $permissions = $this->permissionService->getAllPermissions();

        return Inertia::render(
            'admin/permission/index',
            [
                'permissions' => $permissions,
            ]
        );
    }

    /**
     * Store a newly created permission resource in storage.
     *
     * @param  StorePermissionRequest  $request  The validated request containing the data to create a permission.
     * @return RedirectResponse Redirects to the permissions index with success or error message.
     */
    public function store(StorePermissionRequest $request)
    {
        try {
            $this->permissionService->create($request->validated());

            return to_route('permissions.index')->with('success', 'Permission created successfully');
        } catch (Throwable $e) {
            Log::error($e->getMessage());

            return to_route('permissions.index')->withErrors(['global' => 'Failed to create permission']);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdatePermissionRequest  $request  The validated request containing the update data.
     * @param  Permission  $permission  The permission model to be updated.
     * @return RedirectResponse Redirects to the permissions index with success or error message.
     */
    public function update(UpdatePermissionRequest $request, Permission $permission): RedirectResponse
    {
        try {
            $this->permissionService->update($permission, $request->validated());

            return to_route('permissions.index')->with('success', 'Permission updated successfully');

        } catch (Throwable $e) {
            Log::error($e->getMessage());

            return to_route('permissions.index')->withErrors(['error' => 'Failed to update permission']);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Permission  $permission  The permission model to be deleted.
     * @return RedirectResponse Redirects to the permissions index with success or error message.
     */
    public function destroy(Permission $permission): RedirectResponse
    {
        try {
            $this->permissionService->delete($permission);

            return to_route('permissions.index')->with('success', 'Permission deleted successfully');

        } catch (Throwable $e) {
            Log::error($e->getMessage());

            return to_route('permissions.index')->withErrors(['error' => 'Failed to delete permission']);
        }
    }
}
