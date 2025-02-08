'use client';
import React, { FormEvent, FormHTMLAttributes, createContext, forwardRef } from 'react';
import { getClassNames } from '../utils/getClassNames';
import { ComponentContext } from '../types/ComponentContext';
import { ComponentSize } from '../types/ComponentTypes';

export interface FormLabelProps {
    labelWidth?: string;
    labelPosition?: 'top' | 'start';
    labelAlign?: 'left' | 'right';
}

export interface FormProps extends ComponentContext, FormLabelProps, FormHTMLAttributes<HTMLElement> {
    size?: ComponentSize;
}

export const FormContext = createContext<
    FormLabelProps & {
        size?: ComponentSize;
    }
>({});

const Form = forwardRef<HTMLFormElement, FormProps>((props, ref) => {
    const {
        className,
        size = 'default',
        labelPosition = 'start',
        labelAlign = 'left',
        labelWidth = '100px',
        children,
        ...extraProps
    } = props;

    const classes = getClassNames('form', className);

    function onSubmit(e: FormEvent<HTMLElement>) {
        e.preventDefault();
        props.onSubmit && props.onSubmit(e);
    }

    return (
        <form ref={ref} className={classes} {...extraProps} onSubmit={onSubmit}>
            <FormContext.Provider
                value={{
                    size,
                    labelWidth,
                    labelPosition,
                    labelAlign,
                }}
            >
                {children}
            </FormContext.Provider>
        </form>
    );
});

Form.displayName = 'Form';
export default Form;
