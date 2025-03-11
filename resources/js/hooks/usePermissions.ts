import { groupPermissionsByModel, validatePermission } from '@/helpers';
import type { Permission } from '@/types';
import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

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

    const refreshPermissions = () => {
        router.reload({ only: ['permissions'] });
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
                    toast('Something went wrong');
                },
                onSuccess: () => {
                    setName('');
                    setCurrentModelForAdd(null);
                    setErrors({});
                    refreshPermissions();
                    toast('Permission added successfully');
                },
                onFinish: () => setProcessingAdd(false),
            },
        );
    };

    const updatePermission = (permissionId: number, newVerb: string, model: string) => {
        const validationErrors = validatePermission(newVerb, model, permissionId);
        if (validationErrors) {
            setErrors(validationErrors);
            return;
        }
        const updatedPermissionName = `${newVerb.trim().toLowerCase()}_${model}`;
        setProcessingUpdate(true);
        router.put(
            route('permissions.update', permissionId),
            { name: updatedPermissionName },
            {
                preserveScroll: true,
                onError: (err) => {
                    setErrors(err);
                    toast('Something went wrong');
                },
                onSuccess: () => {
                    setEditingPermission(null);
                    setHighlightedId(permissionId);
                    setName('');
                    setTimeout(() => setHighlightedId(null), 1500);
                    refreshPermissions();
                    toast('Permission updated successfully');
                },
                onFinish: () => setProcessingUpdate(false),
            },
        );
    };

    const deletePermission = (permission: Permission) => (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to delete this permission?')) return;
        setProcessingDelete(permission.id);
        router.delete(route('permissions.destroy', { permission }), {
            preserveScroll: true,
            onError: (err) => {
                setErrors(err);
                toast('Something went wrong');
            },
            onSuccess: () => {
                refreshPermissions();
                toast('Permission deleted successfully');
            },
            onFinish: () => setProcessingDelete(null),
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
