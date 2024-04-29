import React from 'react';
import { ComponentContext } from '../types/ComponentContext';
import { getClassNames } from '../utils/getClassNames';
import { CONTROL_HEIGHT } from '../utils/constants';
import { ComponentSize } from '../types/ComponentTypes';

export interface InputProps
    extends Omit<ComponentContext, 'children'>,
        Omit<React.InputHTMLAttributes<HTMLElement>, 'size'> {
    size?: ComponentSize;
    round?: boolean;
    append?: React.ReactNode;
    prepend?: React.ReactNode;
}

const Input: React.FC<InputProps> = (props) => {
    const { className, style, size = 'default', round, prepend, append, ...extraProps } = props;
    const _size = React.useMemo(() => {
        if (size === 'medium') return 'default';
        return size;
    }, [size]);

    const classes = React.useMemo(
        () =>
            getClassNames(
                'input',
                'flex items-center border rounded bg-white overflow-hidden text-primary',
                CONTROL_HEIGHT[_size],
                {
                    'rounded-full': round,
                },
                className,
            ),
        [_size, className],
    );

    return (
        <div className={classes} style={style}>
            {prepend ? <span className="p-1">{prepend}</span> : null}
            <input className="w-full h-full outline-none px-2" {...extraProps} />
            {append ? <span className="p-1">{append}</span> : null}
        </div>
    );
};

Input.displayName = 'Input';
export default Input;
