import React from 'react';

export interface ComponentContext {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
