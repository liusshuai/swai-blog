import React from 'react';
import createSvgIcon from './createSvgIcon';

export default createSvgIcon(
    <>
        <path
            d="M12 12L24 24L12 36"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M24 12L36 24L24 36"
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
