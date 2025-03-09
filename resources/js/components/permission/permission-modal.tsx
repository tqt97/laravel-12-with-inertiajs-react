import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoaderCircle } from 'lucide-react';
import { FormEvent } from 'react';

export interface AddPermissionModalProps {
    currentModel: string;
    name: string;
    setName: (value: string) => void;
    processing: boolean;
    errors: { name?: string; model?: string; permissionId?: string };
    onCancel: () => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function AddPermissionModal({ currentModel, name, setName, processing, errors, onCancel, onSubmit }: AddPermissionModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <form onSubmit={onSubmit} className="w-full max-w-md rounded bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold">
                    Add permission for model: &nbsp;
                    <span className="font-bold text-blue-600 capitalize">{currentModel}</span>
                </h2>
                <Input
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter permission action (e.g. archive, approve)"
                    className="mb-4"
                />
                <InputError message={errors.name} className="mb-4" />
                <div className="flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={onCancel} className="cursor-pointer hover:bg-gray-200">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing} className="cursor-pointer hover:bg-gray-900">
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />} Save
                    </Button>
                </div>
            </form>
        </div>
    );
}
