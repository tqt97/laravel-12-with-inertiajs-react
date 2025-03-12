// hooks/useFlashToast.ts
import { FlashProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const useFlashToast = () => {
    const { flash } = usePage().props as FlashProps;

    useEffect(() => {
        if (!flash?.success && !flash?.error) return;

        const text = flash.success || flash.error || '';
        let type: 'success' | 'error' | 'delete' = flash.error ? 'error' : 'success';

        if (text.toLowerCase().includes('delete')) {
            type = 'delete';
        }

        toast(text, {
            className: `custom-toast ${type}`,
            duration: 3000,
            icon:
                type === 'delete' ? (
                    <Trash2 className="h-4 w-4" />
                ) : type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4" />
                ) : (
                    <X className="h-4 w-4" />
                ),
        });
    }, [flash]);
};
