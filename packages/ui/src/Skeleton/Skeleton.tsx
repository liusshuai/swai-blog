import React, { useMemo } from 'react';
import { getClassNames } from '../utils/getClassNames';
export interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'rect' | 'circle';
    width?: number | string;
    height?: number;
    animated?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = (props) => {
    const { className, variant = 'text', width = '100%', height } = props;

    const rootClasses = useMemo(() => {
        return getClassNames(
            'skeleton',
            'bg-gray-50 h-[1.2em]',
            {
                'rounded-full': variant === 'circle',
                'animate-pulse': props.animated,
            },
            className,
        );
    }, [className, variant]);

    const _height = useMemo(() => {
        if (variant === 'text') {
            return undefined;
        }

        if (variant === 'circle') {
            return width;
        }

        return height;
    }, [variant, height, width]);

    return <div className={rootClasses} style={{ width, height: _height }}></div>;
};

Skeleton.displayName = 'Skeleton';
export default Skeleton;
