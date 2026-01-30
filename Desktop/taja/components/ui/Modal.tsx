'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
}) => {
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-2xl',
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm fade-in" />
                <Dialog.Content
                    className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            ${sizeClasses[size]} w-full p-8 bg-white rounded-2xl shadow-2xl slide-up`}
                >
                    {title && (
                        <Dialog.Title className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
                            {title}
                        </Dialog.Title>
                    )}
                    {children}
                    <Dialog.Close asChild>
                        <button
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center 
                rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="닫기"
                        >
                            ✕
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
