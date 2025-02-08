import React from 'react';
import createSvgIcon from './createSvgIcon';

export default createSvgIcon(
    <>
        <rect
            x="4"
            y="6"
            width="40"
            height="30"
            rx="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M24 36V43" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 14L16 28" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 43H38" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle
            cx="15"
            cy="17"
            r="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle
            cx="33"
            cy="25"
            r="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </>,
    {
        viewBox: '0 0 48 48',
        fill: 'none',
    },
);
