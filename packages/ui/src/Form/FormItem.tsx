import React, { FormEvent, cloneElement, useContext, useMemo } from 'react';
import { ComponentContext } from '../types/ComponentContext';
import { getClassNames } from '../utils/getClassNames';
import { FormContext, FormLabelProps } from './Form';

export interface FormItemProps extends ComponentContext, FormLabelProps {
    name?: string;
    required?: boolean;
    pattern?: string;
    error?: string;
    helpText?: string | React.ReactNode;
    label?: string | React.ReactNode;
    onInvalid?: (e: FormEvent) => void;
}

const FormItem: React.FC<FormItemProps> = (props) => {
    const { name, className, label, labelPosition, labelAlign, labelWidth, helpText, error, required, pattern } = props;

    const context = useContext(FormContext);

    const _labelPosition = useMemo(
        () => labelPosition || context.labelPosition,
        [context.labelPosition, labelPosition],
    );
    const _labelAlign = useMemo(() => labelAlign || context.labelAlign, [context.labelAlign, labelAlign]);
    const _labelWidth = useMemo(() => labelWidth || context.labelWidth, [context.labelWidth, labelWidth]);

    const classes = useMemo(() => {
        return getClassNames(
            'form-item mb-8',
            {
                flex: Boolean(label),
                'flex-col gap-2': label && _labelPosition === 'top',
                'items-center gap-4': label && _labelPosition === 'start',
            },
            className,
        );
    }, [className, _labelPosition, label]);

    const labelClasses = useMemo(() => {
        return getClassNames('form-item__label', 'shrink-0 text-secondary dark:text-secondary-dark', {
            'text-right': label && _labelPosition === 'start' && _labelAlign === 'right',
        });
    }, [label, _labelPosition, _labelAlign]);

    return (
        <div className={classes}>
            {label ? (
                <label htmlFor={name} className={labelClasses} style={{ width: _labelWidth }}>
                    {required ? (
                        <abbr title="required" className="text-red me-1">
                            *
                        </abbr>
                    ) : null}
                    {label}
                </label>
            ) : null}
            <div className={getClassNames('form-item__control', 'relative grow')}>
                {cloneElement(props.children as React.FunctionComponentElement<any>, {
                    id: name,
                    name,
                    required,
                    pattern,
                    size: context.size,
                    onInvalid: props.onInvalid,
                })}

                {helpText || error ? (
                    <div className={getClassNames('form-item__tip', 'absolute left-0 top-[calc(100%+4px)] text-xs')}>
                        {error ? (
                            <p className="text-error animate-shaking">{error}</p>
                        ) : helpText ? (
                            <p className="text-helper dark:text-helper-dark">{helpText}</p>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

FormItem.displayName = 'FormItem';
export default FormItem;
