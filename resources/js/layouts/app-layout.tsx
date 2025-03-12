import { Toaster } from '@/components/ui/sonner';
import { useFlashToast } from '@/hooks/useFlashToast';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { AppLayoutProps } from '@/types';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    useFlashToast();

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            <Toaster position="top-right" richColors theme="system" closeButton />
        </AppLayoutTemplate>
    );
};
