import Heading from '@/components/heading';
import { PermissionItem } from '@/components/permission/permission-item';
import { AddPermissionModal } from '@/components/permission/permission-modal';
import { Toast } from '@/components/toast';
import { groupPermissionsByModel, validatePermission } from '@/helpers';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Permission } from '@/types';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Head, router } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Permission', href: '/permissions' }];

export default function Permission({ permissions }: { permissions: Permission[] }) {
    const [currentModelForAdd, setCurrentModelForAdd] = useState<string | null>(null);
    const [processingDelete, setProcessingDelete] = useState<number | null>(null);
    const [processingUpdate, setProcessingUpdate] = useState<boolean>(false);
    const [processingAdd, setProcessingAdd] = useState<boolean>(false);
    const [editingPermission, setEditingPermission] = useState<{ id: number; value: string } | null>(null);
    const [highlightedId, setHighlightedId] = useState<number | null>(null);
    const [errors, setErrors] = useState<{ name?: string; model?: string; permissionId?: string }>({});
    const [name, setName] = useState<string>('');

    // use memo to avoid unnecessary re-renders
    const groupedPermissions = useMemo(() => groupPermissionsByModel(permissions), [permissions]);
    const models = Object.keys(groupedPermissions).sort();

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
        router.reload({ only: ['permissions'] }); // 🔥 Chỉ gọi lại prop "permissions"
    };
    const addPermission = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = validatePermission(name, currentModelForAdd ?? undefined);
        if (errors) {
            setErrors(errors);
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

                    refreshPermissions();
                },
                onFinish: () => {
                    setProcessingAdd(false);
                },
            },
        );
    };

    const updatePermission = (permissionId: number, newVerb: string, model: string) => {
        const errors = validatePermission(newVerb, model, permissionId);
        if (errors) {
            setErrors(errors);
            return;
        }
        const updatedPermissionName = `${newVerb.trim().toLowerCase()}_${model}`;
        setProcessingUpdate(true);

        router.put(
            route('permissions.update', permissionId),
            { name: updatedPermissionName },
            {
                preserveScroll: true,
                onError: (err) => setErrors(err),
                onSuccess: () => {
                    setEditingPermission(null);
                    setHighlightedId(permissionId);
                    setName('');
                    setTimeout(() => setHighlightedId(null), 1500);

                    refreshPermissions();
                },
                onFinish: () => {
                    setProcessingUpdate(false);
                },
            },
        );
    };

    const deletePermission = (permission: Permission) => (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to delete this permission?')) return;
        setProcessingDelete(permission.id);
        router.delete(route('permissions.destroy', { permission }), {
            preserveScroll: true,
            onError: (err) => setErrors(err),
            onSuccess: () => refreshPermissions(),
            onFinish: () => setProcessingDelete(null),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="p-6">
                    <Heading title="Permissions" description="Manage permissions for your application" />
                    <Toast />
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {models.map((model) => (
                            <Disclosure defaultOpen key={model}>
                                {({ open }) => (
                                    <div className="rounded border">
                                        <div className="flex w-full items-center justify-between rounded-t bg-gray-900 px-4 py-1 text-white">
                                            <div className="flex items-center">
                                                <span className="text-sm font-bold capitalize">{model}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentModelForAdd(model)}
                                                    className={`p-2 transition-colors duration-150 ${editingPermission !== null ? 'opacity-30' : 'group cursor-pointer'}`}
                                                    title={`Add permission for model: ${model}`}
                                                    disabled={editingPermission !== null}
                                                >
                                                    <Plus className="h-4 w-4 transition-transform duration-150 group-hover:scale-110" />
                                                </button>
                                            </div>
                                            <DisclosureButton className="">
                                                {open ? (
                                                    <ChevronUp className="h-5 w-5 cursor-pointer" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5 cursor-pointer" />
                                                )}
                                            </DisclosureButton>
                                        </div>
                                        <DisclosurePanel className="p-4">
                                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                                {groupedPermissions[model].map((permission) => (
                                                    <PermissionItem
                                                        key={permission.id}
                                                        permission={{ ...permission, action: permission.action || '' }}
                                                        model={model}
                                                        editingPermission={editingPermission}
                                                        setEditingPermission={setEditingPermission}
                                                        processingUpdate={processingUpdate}
                                                        updatePermission={updatePermission}
                                                        deletePermission={deletePermission}
                                                        processingDelete={processingDelete}
                                                        highlightedId={highlightedId}
                                                        formErrors={{ name: errors.name }}
                                                        onCancel={() => cancel()}
                                                    />
                                                ))}
                                            </div>
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                        ))}
                    </div>
                    {/* Modal for adding new permission */}
                    {currentModelForAdd && (
                        <AddPermissionModal
                            currentModel={currentModelForAdd}
                            name={name}
                            setName={setName}
                            processing={processingAdd}
                            errors={errors}
                            onCancel={() => cancel()}
                            onSubmit={addPermission}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
