import React from 'react';
import createSvgIcon from './createSvgIcon';

export default createSvgIcon(
    <>
        <path d="M8 8L40 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 40L40 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </>,
    {
        viewBox: '0 0 48 48',
    },
);
