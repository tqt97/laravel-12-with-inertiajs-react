import { Card, CardContent, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Permission } from '@/types';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permission',
        href: '/permissions',
    },
];

interface RoleForm {
    name: string;
}

export default function Permission({ permissions }: { permissions: Permission[] }) {

    const {
        data,
        setData,
        post,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm<RoleForm>({
        name: '',
    });

    const addPermission: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('permissions.store'), {
            onFinish: () => reset('name'),
        });
    };

    const deletePermission: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('permissions.destroy', e.currentTarget.value), {
            onBefore: () => confirm('Are you sure you want to delete this permission?'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="p-6">
                    <h2 className="mb-4 text-2xl font-bold">Manage Permissions</h2>

                    <form className="flex flex-col gap-6" onSubmit={addPermission}>
                        <Card className="mb-6">
                            <CardTitle className="text-base">Add New Permission</CardTitle>
                            <CardContent className="p-4">
                                <Input value={data.name} name="name" onChange={(e) => setData('name', e.target.value)} placeholder="New Permission" />
                                <InputError message={errors?.name} />
                                <Button type="submit" className="mt-2" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Add Permission
                                </Button>
                            </CardContent>
                        </Card>
                    </form>

                    <div className="grid grid-cols-2 gap-6">
                        {permissions &&
                            permissions.map((permission) => (
                                <form className="flex flex-col gap-6" onSubmit={deletePermission(permission)}>
                                    <Card key={permission.id}>
                                        <CardContent className="flex justify-between p-4">
                                            <h3 className="text-lg font-bold">{permission.name}</h3>
                                            <Button type="submit" className="mt-2" disabled={processing} variant="destructive">
                                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                                Delete
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </form>
                            ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
