import React from 'react';
import { ComponentContext } from '../types/ComponentContext';
import classNames from 'classnames';
import { getClassNames } from '../utils/getClassNames';

export type TypographyType = 'heading' | 'title' | 'subtitle' | 'body' | 'body2' | 'helper';
export type TypographyWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
export type TypographyColor = 'text-primary' | 'text-secondary' | 'text-helper' | string;
export type TypographyLeading = 'none' | 'light' | 'normal' | 'relaxed';
export interface TypographyProps extends ComponentContext {
    tag?: string;
    type?: TypographyType;
    color?: TypographyColor;
    weight?: TypographyWeight;
    leading?: TypographyLeading;
    center?: boolean;
}

const Typography: React.FC<TypographyProps> = (props) => {
    const { tag, center, type = 'body', leading = 'normal', color, weight, children } = props;

    const classes = getClassNames(
        'typography',
        makeClassName(type, color, weight, leading),
        {
            'text-center': center,
        },
        props.className,
    );
    const style = props.style || {};
    if (color && !color.startsWith('text-')) {
        style.color = color;
    }

    return React.createElement(
        tag || getTag(type),
        {
            className: classes,
            style,
        },
        children,
    );
};

function getTag(type: TypographyType) {
    const maps: Record<string, string> = {
        heading: 'h1',
        title: 'h2',
        subtitle: 'h3',
    };

    return maps[type] || 'p';
}

const sizeMap = {
    heading: 'text-2xl',
    title: 'text-xl',
    subtitle: 'text-lg',
    body: 'text-base',
    body2: 'text-base',
    helper: 'text-sm',
};
const colorMap = {
    'text-primary': 'text-primary dark:text-primary-dark',
    'text-secondary': 'text-secondary dark:text-secondary-dark',
    'text-helper': 'text-helper dark:text-helper-dark',
};
const weightMap = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
};
const leadingMap = {
    none: 'leading-none',
    light: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
};
function makeClassName(
    type: TypographyType,
    color?: TypographyColor,
    weight?: TypographyWeight,
    leading?: TypographyLeading,
) {
    let className: string = sizeMap[type];

    if (!weight) {
        if (type === 'heading' || type === 'title') {
            className += ' font-bold';
        }

        if (type === 'subtitle') {
            className += ' font-semibold';
        }
    }

    if (!color) {
        if (type === 'body2') {
            className += ` ${colorMap['text-secondary']}`;
        } else if (type === 'helper') {
            className += ` ${colorMap['text-helper']}`;
        } else {
            className += ` ${colorMap['text-primary']}`;
        }
    } else if (color.startsWith('text-')) {
        className += ` ${colorMap[color as keyof typeof colorMap]}`;
    }

    const classes = classNames(
        leadingMap[leading as keyof typeof leadingMap] || '',
        weightMap[weight as keyof typeof weightMap] || '',
        className,
    );

    return classes;
}

export default Typography;
