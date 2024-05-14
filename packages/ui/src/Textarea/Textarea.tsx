import React, { useMemo } from 'react';
import { ComponentContext } from '../types/ComponentContext';
import { getClassNames } from '../utils/getClassNames';
import { formControlClasses } from '../Form/utils';
import classNames from 'classnames';

export interface TextareaProps
    extends Omit<ComponentContext, 'children'>,
        Omit<React.InputHTMLAttributes<HTMLElement>, 'size'> {
    append?: React.ReactNode;
    prepend?: React.ReactNode;
    rows?: number;
    resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

const RESIZE_MAP = Object.freeze({
    none: 'resize-none',
    both: 'resize',
    horizontal: 'resize-x',
    vertical: 'resize-y',
});

const Textarea: React.FC<TextareaProps> = (props) => {
    const { resize = 'none', append, prepend, rows = 2, className, ...extraProps } = props;

    const classes = getClassNames('textarea', formControlClasses(), className);

    const controlClasses = useMemo(() => {
        const classes = classNames('w-full h-full outline-none p-2 bg-transparent', RESIZE_MAP[resize]);

        return classes;
    }, [resize]);

    return (
        <div className={classes}>
            {prepend ? <div className="px-2 pt-2">{prepend}</div> : null}
            <textarea className={controlClasses} rows={rows} {...extraProps}></textarea>
            {append ? <div className="px-2 pb-2">{append}</div> : null}
        </div>
    );
};

Textarea.displayName = 'Textarea';

export default Textarea;
