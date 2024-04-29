import React from 'react';
import { ComponentContext } from '../types/ComponentContext';
import { ComponentSize } from '../types/ComponentTypes';
import classNames from 'classnames';
import { SpinIcon } from '@swai/icon';

export type ButtonColor = 'primary' | 'secondary';

export interface ButtonProps extends ComponentContext, React.ButtonHTMLAttributes<HTMLElement> {
    icon?: React.ReactNode;
    color?: ButtonColor;
    size?: ComponentSize;
    round?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    loading?: boolean;
}

const sizeMap = Object.freeze({
    large: 'h-10 min-w-24 px-5',
    medium: 'h-8 min-w-20 px-4',
    default: 'h-7 min-w-16 px-3 text-sm',
    small: 'h-6 px-1 text-xs',
});
const colorMap = Object.freeze({
    primary: 'text-white bg-primary enabled:hover:bg-blue-400 enabled:active:focus:bg-blue-500 disabled:opacity-60',
    secondary:
        'text-brand border border-primary enabled:active:opacity-70 disabled:opacity-60 disabled:border-gray-200 disabled:text-gray-400',
});
const Button: React.FC<ButtonProps> = (props) => {
    const {
        icon,
        round,
        fullWidth,
        disabled,
        loading,
        className,
        color = 'primary',
        size = 'default',
        children,
        ...extraProps
    } = props;

    const classes = classNames(
        'sw-button relative',
        'inline-flex items-center gap-2 justify-center py-1',
        'enabled:active:scale-95',
        sizeMap[size],
        color ? colorMap[color] : '',
        'shadow-sm',
        round ? 'rounded-full' : 'rounded',
        {
            'w-full': fullWidth,
            'cursor-not-allowed': disabled || loading,
        },
        className,
    );

    return (
        <button className={classes} disabled={disabled || loading} {...extraProps}>
            {icon}
            <span className={loading ? 'opacity-70' : ''}>{children}</span>

            {loading && !disabled && (
                <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                    <SpinIcon className="animate-spin" size={18} />
                </span>
            )}
        </button>
    );
};

Button.displayName = 'Button';
export default Button;
