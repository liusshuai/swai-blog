import React, { forwardRef } from 'react';
import { ComponentContext } from '../types/ComponentContext';
import { getClassNames } from '../utils/getClassNames';
import { CONTROL_HEIGHT } from '../utils/constants';
import { ComponentSize } from '../types/ComponentTypes';
import { formControlClasses, useFormControlCheck } from '../Form/utils';

export interface InputProps
    extends Omit<ComponentContext, 'children'>,
        Omit<React.InputHTMLAttributes<HTMLElement>, 'size'> {
    size?: ComponentSize;
    round?: boolean;
    append?: React.ReactNode;
    prepend?: React.ReactNode;
}

const Input = forwardRef<HTMLDivElement, InputProps>((props, ref) => {
    const {
        className,
        style,
        size = 'default',
        round,
        prepend,
        append,
        onInvalid,
        onFocus,
        onBlur,
        ...extraProps
    } = props;

    const { invalid, onNativeInvalid, onNativeBlur, onNativeFocus } = useFormControlCheck({
        onInvalid,
        onFocus,
        onBlur,
    });

    const _size = React.useMemo(() => {
        if (size === 'medium') return 'default';
        return size;
    }, [size]);

    const classes = React.useMemo(
        () =>
            getClassNames(
                'input',
                formControlClasses(),
                'flex items-center',
                CONTROL_HEIGHT[_size],
                {
                    'rounded-full': round,
                    'border-error': invalid,
                },
                className,
            ),
        [_size, className, round, invalid],
    );

    return (
        <div ref={ref} className={classes} style={style}>
            {prepend ? <span className="p-1 shrink-0">{prepend}</span> : null}
            <input
                className="grow h-full outline-none px-2 bg-transparent"
                {...extraProps}
                onInvalidCapture={onNativeInvalid}
                onFocus={onNativeFocus}
                onBlur={onNativeBlur}
            />
            {append ? <span className="p-1 shrink-0">{append}</span> : null}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
