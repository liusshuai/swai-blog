'use client';

import { getCaptchaCode } from '../../api/login';
import React, { useEffect, useState } from 'react';

export default function () {
    const [svg, setSvg] = useState<string>('');

    useEffect(() => {
        getCaptcha();

        return () => {
            setSvg('');
        };
    }, []);

    function getCaptcha() {
        getCaptchaCode().then((svg) => {
            setSvg(svg);
        });
    }

    return <div dangerouslySetInnerHTML={{ __html: svg }} onClick={getCaptcha}></div>;
}
