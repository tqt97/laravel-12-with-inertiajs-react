import Heading from '@/components/heading';
import { PermissionItem } from '@/components/permission/permission-item';
import { AddPermissionModal } from '@/components/permission/permission-modal';
import { Toast } from '@/components/toast';
import { usePermissions } from '@/hooks/usePermissions';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Permission } from '@/types';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Head } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Permission', href: '/permissions' }];

export default function Permission({ permissions }: { permissions: Permission[] }) {
    const {
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
    } = usePermissions(permissions);

    const models = Object.keys(groupedPermissions).sort();

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
