'use client'

import { get } from '@/utils/request';
import React, { useEffect, useState } from 'react';

export default function() {
    const [svg, setSvg] = useState<string>('');

    useEffect(() => {
        getCaptcha();

        return () => {
            setSvg('');
        }
    }, []);

    function getCaptcha() {
        get<string>('/api/v1/captcha/get').then((svg) => {
            setSvg(svg);
        });
    }

    return <div dangerouslySetInnerHTML={{ __html: svg }}></div>
}
