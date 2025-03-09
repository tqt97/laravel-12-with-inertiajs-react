import { usePage } from '@inertiajs/react';
import clsx from 'clsx';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface FlashProps {
    flash?: { success?: string; error?: string };
}

export const Toast: React.FC = () => {
    const { flash } = usePage().props as FlashProps;
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'delete'; text: string } | null>(null);
    const [progressWidth, setProgressWidth] = useState(100);
    const [isVisible, setIsVisible] = useState(false);
    const timerRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const startCountdown = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        const startTime = performance.now();

        const updateProgress = () => {
            const elapsed = performance.now() - startTime;
            const newWidth = Math.max(0, 100 - (elapsed / 3000) * 100);

            setProgressWidth(newWidth);
            if (newWidth > 0) {
                animationFrameRef.current = requestAnimationFrame(updateProgress);
            } else {
                setIsVisible(false);
                setTimeout(() => setMessage(null), 300);
            }
        };

        animationFrameRef.current = requestAnimationFrame(updateProgress);
        timerRef.current = window.setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => setMessage(null), 300);
        }, 3000);
    }, []);

    useEffect(() => {
        if (!flash?.success && !flash?.error) return;

        const text = flash.success || flash.error || '';
        let type: 'success' | 'error' | 'delete' = flash.error ? 'error' : 'success';

        if (text.toLowerCase().includes('deleted successfully')) {
            type = 'delete';
        }

        setMessage({ type, text });
        setProgressWidth(100);
        setIsVisible(true);
        startCountdown();
    }, [flash, startCountdown]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => setMessage(null), 300);
        if (timerRef.current) clearTimeout(timerRef.current);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };

    if (!message?.text) return null;

    return (
        <div
            className={clsx('fixed top-10 right-12 z-50 flex w-80 flex-col rounded-lg px-4 py-2 text-sm shadow-lg transition-all duration-300', {
                'border border-green-400 bg-green-50/50 text-green-700 shadow hover:bg-green-50 hover:shadow-md': message.type === 'success',
                'border border-red-400 bg-red-50/50 text-red-700 shadow hover:bg-red-50 hover:shadow-md':
                    message.type === 'error' || message.type === 'delete',
            })}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
        >
            <div className="flex items-center gap-3">
                {message.type === 'delete' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                <span>{message.text}</span>
                <button onClick={handleClose} className="ml-auto cursor-pointer text-inherit">
                    <X size={12} />
                </button>
            </div>

            {/* progress bar */}
            <div className="mt-2 h-[1.5px] w-full rounded bg-gray-200">
                <div
                    className={clsx('h-full rounded', {
                        'bg-green-300': message.type === 'success',
                        'bg-red-300': message.type === 'error' || message.type === 'delete',
                    })}
                    style={{
                        width: `${progressWidth}%`,
                        transition: 'width 0.1s linear',
                    }}
                ></div>
            </div>
        </div>
    );
};
