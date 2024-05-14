import React from 'react';
import { ComponentContext } from '../types/ComponentContext';
import { getClassNames } from '../utils/getClassNames';

export interface BottomToolBarProps extends ComponentContext {
    withSpace?: boolean;
}
const BottomToolBar: React.FC<BottomToolBarProps> = (props) => {
    const { withSpace = true } = props;

    const classes = getClassNames(
        'bottom-tool-bar',
        [
            'fixed z-framework left-0 bottom-0 right-0',
            'p-3 h-14 bg-content border-t dark:bg-content-dark dark:border-t-dark',
        ],
        props.className,
    );

    return (
        <>
            <div className={classes}>{props.children}</div>
            {withSpace ? (
                <div className={getClassNames('bottom-tool-bar__space', ['h-16 bg-transparent'])}></div>
            ) : null}
        </>
    );
};

BottomToolBar.displayName = 'BottomToolBar';
export default BottomToolBar;
