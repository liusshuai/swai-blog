export function formatTime(time: string) {
    const date = new Date(time);

    const y = date.getFullYear();
    const m = addZero(date.getMonth() + 1);
    const d = addZero(date.getDate());

    const hh = addZero(date.getHours());
    const mm = addZero(date.getMinutes());

    return `${y}-${m}-${d} ${hh}:${mm}`;
}

function addZero(n: number): string {
    return n > 9 ? n.toString() : `0${n}`;
}
