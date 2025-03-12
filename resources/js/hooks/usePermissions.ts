import { groupPermissionsByModel, validatePermission } from '@/helpers';
import type { Permission } from '@/types';
import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export function usePermissions(permissions: Permission[]) {
    const [currentModelForAdd, setCurrentModelForAdd] = useState<string | null>(null);
    const [processingDelete, setProcessingDelete] = useState<number | null>(null);
    const [processingUpdate, setProcessingUpdate] = useState(false);
    const [processingAdd, setProcessingAdd] = useState(false);
    const [editingPermission, setEditingPermission] = useState<{ id: number; value: string } | null>(null);
    const [highlightedId, setHighlightedId] = useState<number | null>(null);
    const [errors, setErrors] = useState<{ name?: string; model?: string; permissionId?: string }>({});
    const [name, setName] = useState('');

    const groupedPermissions = useMemo(() => groupPermissionsByModel(permissions), [permissions]);

    const cancel = () => {
        setName('');
        setEditingPermission(null);
        setHighlightedId(null);
        setErrors({});
        setCurrentModelForAdd(null);
        setProcessingUpdate(false);
        setProcessingAdd(false);
        setProcessingDelete(null);
    };

    const addPermission = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors = validatePermission(name, currentModelForAdd ?? undefined);
        if (validationErrors) {
            setErrors(validationErrors);
            return;
        }
        const permissionName = `${name.trim().toLowerCase()}_${currentModelForAdd}`;
        setProcessingAdd(true);
        router.post(
            route('permissions.store'),
            { name: permissionName, is_custom: true },
            {
                preserveScroll: true,
                onError: (err) => {
                    if (err.global) {
                        cancel();
                    } else {
                        setErrors(err);
                    }
                },
                onSuccess: () => {
                    setName('');
                    setCurrentModelForAdd(null);
                    setErrors({});
                },
                onFinish: () => {
                    setProcessingAdd(false);
                },
            },
        );
    };

    const updatePermission = (permissionId: number, action: string, model: string) => {
        const validationErrors = validatePermission(action, model, permissionId);
        if (validationErrors) {
            setErrors(validationErrors);
            return;
        }
        const updatedPermissionName = `${action.trim().toLowerCase()}_${model}`;
        setProcessingUpdate(true);
        router.put(
            route('permissions.update', permissionId),
            { name: updatedPermissionName },
            {
                preserveScroll: true,
                onError: (err) => {
                    setErrors(err);
                },
                onSuccess: () => {
                    setEditingPermission(null);
                    setHighlightedId(permissionId);
                    setName('');
                    setTimeout(() => setHighlightedId(null), 1500);
                },
                onFinish: () => {
                    setProcessingUpdate(false);
                },
            },
        );
    };

    const deletePermission = (permission: Permission) => (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to delete this permission?')) {
            return;
        }
        setProcessingDelete(permission.id);
        router.delete(route('permissions.destroy', { permission }), {
            preserveScroll: true,
            onError: (err) => {
                setErrors(err);
            },
            onFinish: () => {
                setProcessingDelete(null);
            },
        });
    };

    return {
        currentModelForAdd,
        setCurrentModelForAdd,
        processingDelete,
        processingUpdate,
        processingAdd,
        editingPermission,
        setEditingPermission,
        highlightedId,
        errors,
        name,
        setName,
        groupedPermissions,
        cancel,
        addPermission,
        updatePermission,
        deletePermission,
    };
}
