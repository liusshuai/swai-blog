import React from 'react';
import createSvgIcon from './createSvgIcon';

export default createSvgIcon(
    <>
        <path
            d="M44 24V9H24H4V24V39H24"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="36" cy="34" r="5" fill="currentColor" stroke="currentColor" strokeWidth="4" />
        <path d="M40 37L44 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 9L24 24L44 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </>,
    {
        viewBox: '0 0 48 48',
        fill: 'none',
    },
);
