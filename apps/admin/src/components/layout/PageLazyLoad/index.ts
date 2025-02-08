import React from 'react';
import LazyLoad from './LazyLoad';

export default function lazy(Comp: React.ReactNode) {
    return React.createElement(LazyLoad, null, Comp);
}
