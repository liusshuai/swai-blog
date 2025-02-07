export function isScrollable(el: HTMLElement): boolean {
    const hasScrollableContent = el.scrollHeight > el.clientHeight;

    const overflowYStyle = window.getComputedStyle(el).overflowY;
    const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;

    return hasScrollableContent && !isOverflowHidden;
}

export const isBrowser: boolean = typeof window !== undefined;

export function onElementSizeChange(el: HTMLElement | null, update: () => void) {
    const obs: ResizeObserver[] = [];
    let curEl = el;
    let timer: any;

    const _update = () => {
        timer && clearTimeout(timer);
        timer = setTimeout(update, 100);
    };

    while (curEl !== null) {
        const ob = new ResizeObserver(_update);
        ob.observe(curEl);
        obs.push(ob);

        curEl = curEl.parentElement;
    }

    return () => {
        for (const ob of obs) {
            ob.disconnect();
        }
    };
}
