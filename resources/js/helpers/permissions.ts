import { Permission } from '@/types';

/**
 * Groups permissions by model extracted from the permission name.
 * The permission name is expected to be in the format "action_model".
 * The action is separated and stored as part of the permission object.
 * If the model is not present, it defaults to 'others'.
 *
 * @param permissions - Array of Permission objects to be grouped.
 * @returns An object where keys are model names and values are arrays of permissions associated with each model.
 */
export function groupPermissionsByModel(permissions: Permission[]): Record<string, Permission[]> {
    return permissions.reduce(
        (groups, perm) => {
            const parts = perm.name.split('_');
            const model = parts.slice(1).join('_') || 'others';
            const action = parts[0];
            if (!groups[model]) {
                groups[model] = [];
            }
            groups[model].push({ ...perm, action });
            return groups;
        },
        {} as Record<string, Permission[]>,
    );
}

/**
 * Validates the permission details by checking for missing or invalid fields.
 *
 * @param name - The name of the permission, which is required and must not be empty.
 * @param model - An optional string representing the model associated with the permission. If provided, it must not be empty.
 * @param permissionId - An optional number representing the permission ID. If provided, it must not be zero or undefined.
 * @returns An object containing error messages for each invalid field, or null if all fields are valid.
 */
export function validatePermission(
    name: string,
    model?: string,
    permissionId?: number,
): { name?: string; model?: string; permissionId?: string } | null {
    const errors: { name?: string; model?: string; permissionId?: string } = {};
    if (!name.trim()) errors.name = 'Permission name is required';
    if (model !== undefined && !model.trim()) errors.model = 'Model is required';
    if (permissionId !== undefined && !permissionId) errors.permissionId = 'Permission ID is required';
    return Object.keys(errors).length ? errors : null;
}
