'use client';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { getClassNames } from '../utils/getClassNames';
import { ComponentContext } from '../types/ComponentContext';
import { ComponentSize } from '../types/ComponentTypes';
import Input from '../Input';
import Popup from '../Popup';
import { ArrowIcon } from '@swai/icon';
import { PopupRef } from '../Popup/Popup';

export interface SelectProps extends ComponentContext {
    value: any;
    options: Record<string, any>[];
    size?: ComponentSize;
    placeholder?: string;
    labelKey?: string;
    valueKey?: string;
    disabled?: boolean;
    onChange?: (v: any) => void;
}

const Select: React.FC<SelectProps> = (props) => {
    const {
        value,
        size = 'default',
        placeholder = '请选择',
        options = [],
        labelKey = 'label',
        valueKey = 'value',
        disabled = false,
    } = props;

    const anchorRef = useRef<HTMLDivElement | null>(null);
    const popRef = useRef<PopupRef | null>(null);

    const [open, setOpen] = useState<boolean>(false);
    const [contentWidth, setContentWidth] = useState('auto');

    const classes = getClassNames('select', props.className);

    const inputValue = useMemo(() => {
        const op = props.options.find((op) => op[valueKey] === props.value);

        return op ? op[labelKey] : '';
    }, [value, props.options]);

    useLayoutEffect(computeContentWidth, []);

    useEffect(() => {
        window.addEventListener('resize', computeContentWidth);

        return () => {
            window.removeEventListener('resize', computeContentWidth);
        };
    }, []);

    function computeContentWidth() {
        const inputWidth = anchorRef.current?.offsetWidth;
        setContentWidth(inputWidth ? inputWidth + 'px' : 'auto');
    }

    function onShow() {
        setOpen(true);
    }

    function onHide() {
        setOpen(false);
    }

    function onInputFocus() {
        popRef.current?.open();
    }

    function onInputBlur() {
        popRef.current?.close();
    }

    function onOptionClick(op: Record<string, any>) {
        props.onChange && props.onChange(op[valueKey]);
    }

    return (
        <div className={classes}>
            <Popup
                ref={popRef}
                trigger="manual"
                position="bottom-left"
                anchorClasses="!block"
                content={
                    <ul className="shadow bg-white w-full" style={{ width: contentWidth }}>
                        {options.map((option) => (
                            <li
                                className="text-sm px-4 py-2 cursor-pointer border-b border-gray-50 last:border-b-0 hover:bg-blue-50"
                                key={option[valueKey]}
                                onClick={() => onOptionClick(option)}
                            >
                                {option[labelKey]}
                            </li>
                        ))}
                    </ul>
                }
                show={onShow}
                hide={onHide}
            >
                <Input
                    value={inputValue}
                    ref={anchorRef}
                    readOnly
                    placeholder={placeholder}
                    size={size}
                    disabled={disabled}
                    className={disabled ? '' : 'border-form-control dark:border-form-control-dark'}
                    append={<ArrowIcon className="text-secondary" size={16} direction={open ? 'left' : 'right'} />}
                    onFocus={onInputFocus}
                    onBlur={onInputBlur}
                />
            </Popup>
        </div>
    );
};

Select.displayName = 'Select';
export default Select;
