import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hover = true,
    onClick,
}) => {
    return (
        <div
            className={`card ${hover ? '' : 'hover:shadow-md hover:transform-none'} ${className} ${onClick ? 'cursor-pointer' : ''
                }`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
