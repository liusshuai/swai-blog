import React from 'react';
import createSvgIcon from './createSvgIcon';

export default createSvgIcon(
    <>
        <circle cx="12" cy="24" r="3" fill="currentColor" />
        <circle cx="24" cy="24" r="3" fill="currentColor" />
        <circle cx="36" cy="24" r="3" fill="currentColor" />
    </>,
    {
        viewBox: '0 0 48 48',
        fill: 'none',
    },
);
