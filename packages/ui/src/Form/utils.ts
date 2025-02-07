'use client';

import classNames from 'classnames';
import { useState } from 'react';

export function formControlClasses() {
    return classNames([
        'has-[:enabled]:hover:shadow-form-control has-[:focus]:border-primary',
        'rounded-feedback border',
        'has-[:valid]:border-form-control dark:has-[:valid]:border-form-control-dark',
        'bg-white overflow-hidden dark:bg-[#292A2E]',
        'text-primary text-sm dark:text-primary-dark',
        'transition-all duration-150',
    ]);
}

export function useFormControlCheck(evts: {
    onInvalid?: React.FormEventHandler<HTMLElement>;
    onFocus?: React.FormEventHandler<HTMLElement>;
    onBlur?: React.FormEventHandler<HTMLElement>;
}) {
    const { onInvalid, onBlur, onFocus } = evts;
    const [invalid, setInvalid] = useState<boolean>(false);

    function onNativeInvalid<T>(e: React.InvalidEvent<T | any>) {
        if (!e.target.validity.valid) {
            setInvalid(true);
        }
        onInvalid && onInvalid(e);
    }

    function onNativeFocus<T>(e: React.FocusEvent<T | any>) {
        setInvalid(false);
        onFocus && onFocus(e);
    }

    function onNativeBlur<T>(e: React.FocusEvent<T | any>) {
        if (!e.target.validity.valid) {
            setInvalid(true);
        }
        onBlur && onBlur(e);
    }

    return {
        invalid,
        onNativeInvalid,
        onNativeFocus,
        onNativeBlur,
    };
}
