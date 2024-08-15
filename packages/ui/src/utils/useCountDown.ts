'use client';

import { startTransition, useEffect, useMemo, useRef, useState } from 'react';

export type CurrentTime = {
    days: number;
    hours: number;
    total: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
};

export interface useCountDownOptions {
    time: number;
    millisecond?: boolean;
    onChange?: (current: CurrentTime) => void;
    onFinish?: () => void;
}
const DAY_TIMESTAMP = 24 * 3600 * 1000;
const HOUR_TIMESTAMP = 3600 * 1000;
const MINUTES_TIMESTAMP = 60 * 1000;
export function useCountDown(options: useCountDownOptions) {
    const timer = useRef<any>(null);

    const [started, setStarted] = useState<boolean>(false);
    const [time, setTime] = useState<number>(options.time);

    const reduceCount = useMemo(() => {
        return options.millisecond ? 1 : 1000;
    }, [options.millisecond]);

    const current = useMemo<CurrentTime>(() => {
        let rest = time;
        const days = Math.floor(time / DAY_TIMESTAMP);
        const hours = Math.floor((rest = rest - days * DAY_TIMESTAMP) / HOUR_TIMESTAMP);
        const minutes = Math.floor((rest = rest - hours * HOUR_TIMESTAMP) / MINUTES_TIMESTAMP);
        const seconds = Math.floor((rest = rest - minutes * MINUTES_TIMESTAMP) / 1000);
        const milliseconds = rest - seconds * 1000;

        return {
            total: time,
            days,
            hours,
            minutes,
            seconds,
            milliseconds,
        };
    }, [time]);

    useEffect(() => {
        return clearTimer;
    }, []);

    useEffect(() => {
        timer.current = setTimeout(excute, reduceCount);

        return clearTimer;
    }, [time]);

    useEffect(() => {
        if (started) {
            excute();
        } else {
            clearTimer();
        }
    }, [started]);

    useEffect(() => {
        options.onChange && options.onChange(current);
    }, [current]);

    function clearTimer() {
        timer.current && clearTimeout(timer.current);
    }

    function excute() {
        if (time <= 0 || !started) {
            time <= 0 && options.onFinish && options.onFinish();
            return pause();
        }
        setTime((preTime: number) => {
            const next = preTime - reduceCount;
            if (next <= 0) {
                return 0;
            }

            return next;
        });
    }

    function start() {
        setStarted(true);
    }

    function pause() {
        setStarted(false);
    }

    function reset(time?: number) {
        clearTimer();
        setTime(time || options.time);
        setStarted(true);
    }

    return {
        time,
        current,
        start,
        pause,
        reset,
    };
}
