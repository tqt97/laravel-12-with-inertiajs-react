import InputError from '@/components/input-error';
import { Card, CardContent } from '@/components/ui/card';
import { Permission } from '@/types';
import { Check, LoaderCircle, Pencil, Trash2, X } from 'lucide-react';
import { FormEvent } from 'react';

export interface PermissionItemProps {
    permission: Permission;
    model: string;
    editingPermission: { id: number; value: string } | null;
    setEditingPermission: (val: { id: number; value: string } | null) => void;
    processingUpdate: boolean;
    updatePermission: (permissionId: number, newVerb: string, model: string) => void;
    deletePermission: (permission: Permission) => (e: FormEvent<HTMLFormElement>) => void;
    processingDelete: number | null;
    highlightedId: number | null;
    formErrors: { name?: string };
    onCancel: () => void;
}

export function PermissionItem({
    permission,
    model,
    editingPermission,
    setEditingPermission,
    processingUpdate,
    updatePermission,
    deletePermission,
    processingDelete,
    highlightedId,
    formErrors,
    onCancel,
}: PermissionItemProps) {
    const isEditing = editingPermission?.id === permission.id;
    const className = [
        'flex items-center justify-between rounded px-2 py-1 hover:shadow',
        // permission.is_custom ? '' : 'text-gray-700',
        processingDelete === permission.id ? 'opacity-50' : '',
        highlightedId === permission.id ? 'border-green-200 bg-green-50 transition-colors duration-100' : '',
    ].join(' ');

    return (
        <form key={permission.id} onSubmit={deletePermission(permission)}>
            <Card>
                <CardContent className={className}>
                    {isEditing ? (
                        <div className="flex w-full flex-wrap">
                            <InputError message={formErrors.name} />
                            <div className="flex w-full items-center gap-2">
                                <input
                                    value={editingPermission?.value ?? ''}
                                    onChange={(e) => setEditingPermission({ id: permission.id, value: e.target.value })}
                                    className={`w-full rounded-md border border-gray-300 px-2 py-1 ${formErrors.name ? 'border-red-500' : ''}`}
                                    disabled={processingUpdate}
                                />
                                <button
                                    type="button"
                                    onClick={() => updatePermission(permission.id, editingPermission?.value ?? '', model)}
                                    className="group cursor-pointer p-2 hover:bg-gray-50"
                                    disabled={processingUpdate}
                                    title={processingUpdate ? 'Updating...' : 'Update'}
                                >
                                    {processingUpdate ? (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Check className="h-4 w-4 text-green-400 transition-colors duration-100 group-hover:text-green-600" />
                                    )}
                                </button>
                                <button type="button" onClick={() => onCancel()} className="group cursor-pointer p-2 hover:bg-gray-50" title="Cancel">
                                    <X className="h-4 w-4 text-gray-600 transition-colors duration-100 group-hover:text-red-500" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <span className="text-sm font-medium capitalize">{permission.action}</span>
                            {permission.is_custom ? (
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingPermission({ id: permission.id, value: permission.action ?? '' })}
                                        className="group cursor-pointer p-2 hover:bg-gray-50"
                                        title="Edit"
                                    >
                                        <Pencil className="h-4 w-4 text-gray-900 transition-colors duration-100 group-hover:text-gray-600" />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processingDelete === permission.id}
                                        className="group cursor-pointer p-2 hover:bg-gray-50"
                                        title="Delete"
                                    >
                                        {processingDelete === permission.id ? (
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4 text-red-600 transition-colors duration-100 group-hover:text-red-500" />
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <span className="p-2 text-xs text-gray-500 italic">Default</span>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </form>
    );
}
