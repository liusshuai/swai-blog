import React, { useMemo } from 'react';
import Popup, { PopupProps } from '../Popup/Popup';
import { getClassNames } from '../utils/getClassNames';

export interface TooltipProps {
    disabled?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
    trigger?: PopupProps['trigger'];
    anchorClasses?: string;
    space?: number;
    content: string;
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = (props) => {
    const { trigger = 'hover', position = 'top', content } = props;

    const arrowClasses = useMemo(() => {
        return getClassNames('tooltip__arrow', 'absolute w-2 h-2 bg-inherit rotate-45', {
            'left-1/2 -translate-x-1/2': position === 'top' || position === 'bottom',
            '-top-1': position === 'bottom',
            '-bottom-1': position === 'top',
            'top-1/2 -translate-y-1/2': position === 'left' || position === 'right',
            '-left-1': position === 'right',
            '-right-1': position === 'left',
        });
    }, [position]);

    return (
        <Popup
            trigger={trigger}
            position={position}
            space={props.space}
            disabled={props.disabled}
            anchorClasses={props.anchorClasses}
            content={
                <div
                    className={getClassNames(
                        'tooltip__content',
                        'relative text-sm rounded-feedback p-2 bg-content-dark text-white',
                    )}
                >
                    {content}
                    <span className={arrowClasses}></span>
                </div>
            }
        >
            {props.children}
        </Popup>
    );
};

Tooltip.displayName = 'Tooltip';
export default Tooltip;
