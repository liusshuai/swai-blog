import React from 'react';

export function renderChildren<T = any>(
    children: React.ReactNode,
    childDisplayNames: string[] | string,
    props?: T,
    errorText?: string,
): React.ReactNode {
    return React.Children.map(children, (child) => {
        const childEl = child as React.FunctionComponentElement<T>;
        const { displayName = '' } = childEl.type || {};
        if (
            (typeof childDisplayNames === 'string' && childDisplayNames === displayName) ||
            (childDisplayNames instanceof Array && childDisplayNames.includes(displayName))
        ) {
            return React.cloneElement(childEl, { ...(props || {}) });
        } else {
            const tips = errorText ? errorText : `Ensure that the child node is from ${childDisplayNames.toString()}`;
            console.error(tips);
        }
    });
}
