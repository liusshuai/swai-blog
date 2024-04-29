import React from 'react';
import { ComponentContext } from '../types/ComponentContext';
import { getClassNames } from '../utils/getClassNames';
import { CONTROL_HEIGHT } from '../utils/constants';
import { ComponentSize } from '../types/ComponentTypes';

export interface SwitchProps extends Omit<ComponentContext, 'children'> {
    value: boolean;
    activeText?: string;
    inactiveText?: string;
    size?: ComponentSize;

    onChange?: (value: boolean) => void;
}

const CONTROL_WIDTH = Object.freeze({
    small: 'w-14',
    default: 'w-16',
    large: 'w-20',
});
const CONTROL_INNSER_WIDTH = Object.freeze({
    small: 'w-4 h-4',
    default: 'w-5 h-5',
    large: 'w-6 h-6',
});
const INNER_TRANS = Object.freeze({
    small: 'translate-x-9',
    default: 'translate-x-10',
    large: 'translate-x-[3.2rem]',
});
const Switch: React.FC<SwitchProps> = (props) => {
    const { size = 'default' } = props;

    const _size = React.useMemo(() => {
        if (size === 'medium') return 'default';
        return size;
    }, [size]);

    const wrapClasses = getClassNames(
        'switch',
        'rounded-full relative transition-all duration-200',
        CONTROL_WIDTH[_size],
        CONTROL_HEIGHT[_size],
        [props.value ? 'bg-primary tablet:hover:bg-blue-400' : 'bg-gray-300 tablet:hover:bg-gray-400'],
        props.className,
    );

    const innerClasses = getClassNames(
        'switch__inner',
        CONTROL_INNSER_WIDTH[_size],
        'block overflow-hidden bg-white rounded-full shadow-md',
        'transition-all	duration-200',
        props.value ? INNER_TRANS[_size] : 'translate-x-1',
    );

    const textClasses = getClassNames('switch__text', 'text-white absolute text-sm top-1/2 -translate-y-1/2', [
        props.value ? 'left-2' : 'right-2',
    ]);

    function handleOnClick() {
        props.onChange && props.onChange(!props.value);
    }

    return (
        <button role="switch" className={wrapClasses} onClick={handleOnClick} aria-checked={props.value}>
            <span className={textClasses}>{props.value ? props.activeText : props.inactiveText}</span>
            <span className={innerClasses}></span>
        </button>
    );
};

Switch.displayName = 'Switch';
export default Switch;
