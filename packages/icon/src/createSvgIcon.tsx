import React from 'react';

export interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string | 'inherit';
    color?: string;
    direction?: 'up' | 'right' | 'down' | 'left';
}

interface CreateSvgIconOptions {
    viewBox?: `0 0 ${number} ${number}`;
    fill?: string;
}

export default function createSvgIcon(children: React.ReactNode, options?: CreateSvgIconOptions) {
    return function SvgIcon({ size = 24, direction = 'up', color, ...props }: SvgIconProps) {
        const fontSize = React.useMemo(() => {
            if (typeof size === 'number') {
                return `${size}px`;
            }

            return size;
        }, [size]);
        const transform = React.useMemo(() => {
            switch (direction) {
                case 'right':
                    return 'rotate(90deg)';
                case 'down':
                    return 'rotate(180deg)';
                case 'left':
                    return 'rotate(270deg)';
                case 'up':
                default:
                    return '';
            }
        }, [direction]);

        return (
            <svg
                style={{ fontSize, transform }}
                width="1em"
                height="1em"
                fill="currentColor"
                color={color}
                {...options}
                {...props}
            >
                {children}
            </svg>
        );
    };
}
