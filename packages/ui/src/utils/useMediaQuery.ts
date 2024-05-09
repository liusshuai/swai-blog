'use client'

import { useLayoutEffect, useState } from "react"

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(false);

    useLayoutEffect(() => {
        if (typeof matchMedia !== 'undefined') {
            let mql: MediaQueryList | undefined = matchMedia(query);

            setMatches(mql?.matches || false);
            const listener = (e: MediaQueryListEvent) => {
                setMatches(e.matches);
            }

            mql?.addEventListener('change', listener);

            return () => {
                if (mql) {
                    mql.removeEventListener('change', listener);
                    mql = undefined;
                }
            }
        }
    }, [query]);

    return matches;
}

export function useMobileMediaQuery() {
    return useMediaQuery('(max-width: 719px)');
}

export function useTabletMediaQuery() {
    return useMediaQuery('(min-width: 720px)');
}

export function useDesktopMediaQuery() {
    return useMediaQuery('(min-width: 1024px)');
}
