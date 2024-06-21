import React from 'react';

export default (props: { children: React.ReactNode }) => {
    return <React.Suspense fallback={<p>Loading...</p>}>{props.children}</React.Suspense>;
};
