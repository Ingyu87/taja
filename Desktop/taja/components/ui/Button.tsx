import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseClasses = 'btn';
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        accent: 'btn-accent',
    };

    const sizeClasses = {
        sm: 'text-base px-5 py-3 min-h-[48px]',
        md: 'text-lg px-8 py-4 min-h-[56px]',
        lg: 'text-xl px-10 py-5 min-h-[64px]',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full spin" />
            )}
            {children}
        </button>
    );
};
