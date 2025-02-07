'use client';
import React, { ReactNode, useMemo, useRef, useState } from 'react';
import { ArrowIcon, DoubleArrowIcon, CalendarIcon } from '@swai/icon';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Input from '../Input';
import Popup from '../Popup';
import { MONTH_PLAIN_TEXT } from '../utils/constants';
import { ComponentContext } from '../types/ComponentContext';
import { ComponentSize } from '../types/ComponentTypes';
import { PopupRef } from '../Popup/Popup';
import useClickAway from '../utils/useClickAway';

interface DatePickerHeadProps {
    onPrev?: () => void;
    onParentPrev?: () => void;
    onNext?: () => void;
    onParentNext?: () => void;
    showArrow?: boolean;
    showParentArrow?: boolean;
    children: ReactNode;
}
const DatePickerHead = (props: DatePickerHeadProps) => {
    const arrowBtnClasses = 'cursor-pointer hover:text-brand';

    const { showArrow = true, showParentArrow = true } = props;

    return (
        <div className="py-4 px-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-gray-300">
                {showParentArrow && (
                    <DoubleArrowIcon
                        className={arrowBtnClasses}
                        direction="down"
                        size={18}
                        onClick={props.onParentPrev}
                    />
                )}
                {showArrow && (
                    <ArrowIcon className={arrowBtnClasses} direction="down" size={18} onClick={props.onPrev} />
                )}
            </span>
            <span className="text-lg font-medium">{props.children}</span>
            <span className="inline-flex items-center gap-2 text-gray-300">
                {showArrow && <ArrowIcon className={arrowBtnClasses} size={18} onClick={props.onNext} />}
                {showParentArrow && (
                    <DoubleArrowIcon className={arrowBtnClasses} size={18} onClick={props.onParentNext} />
                )}
            </span>
        </div>
    );
};

interface DatePickerDateProps {
    currentDate: DateItem;
    controlDate: DateItem;
    activeDate: DateItem;
    onYearChoose?: () => void;
    onMonthChoose?: () => void;
    onDateChange?: (date: DateItem) => void;
    onControlDateChange?: (value: number, type: keyof DateItem) => void;
}
interface DateItem {
    year: number;
    month: number;
    date: number;
}
const DatePickerDate = (props: DatePickerDateProps) => {
    const { controlDate, currentDate, activeDate } = props;

    const dates = useMemo(() => {
        const { year, month } = controlDate;
        const prevDate = new Date(year, month - 1, 0);
        const nextDate = new Date(year, month + 1, 0);

        const prevYear = prevDate.getFullYear();
        const prevMonth = prevDate.getMonth() + 1;
        const prevDayCount = prevDate.getDate();

        const nextYear = nextDate.getFullYear();
        const nextMonth = nextDate.getMonth() + 1;

        const dayCount = new Date(year, month, 0).getDate();
        const firstDay = new Date(year, month - 1, 1).getDay();

        const dates: DateItem[] = [];
        for (let i = firstDay; i > 0; i--) {
            dates.push({
                year: prevYear,
                month: prevMonth,
                date: prevDayCount - i,
            });
        }
        dates.push(
            ...Array.from({ length: dayCount }, (_, i) => ({
                year,
                month,
                date: i + 1,
            })),
        );

        for (let i = 1; dates.length < 42; i++) {
            dates.push({
                year: nextYear,
                month: nextMonth,
                date: i,
            });
        }

        return dates;
    }, [controlDate]);

    function onMonthChange(dir: 'prev' | 'next') {
        return function () {
            const { year, month } = controlDate;
            const prevDate = new Date(year, dir === 'prev' ? month - 2 : month, 1);
            props.onControlDateChange && props.onControlDateChange(prevDate.getMonth() + 1, 'month');
        };
    }

    function onYearChange(dir: 'prev' | 'next') {
        return function () {
            const { year } = controlDate;
            const prevDate = new Date(dir === 'prev' ? year - 1 : year + 1, 0, 1);
            props.onControlDateChange && props.onControlDateChange(prevDate.getFullYear(), 'year');
        };
    }

    function onDateChange(date: DateItem) {
        props.onDateChange && props.onDateChange(date);
    }

    return (
        <>
            <DatePickerHead
                onPrev={onMonthChange('prev')}
                onParentPrev={onYearChange('prev')}
                onNext={onMonthChange('next')}
                onParentNext={onYearChange('next')}
            >
                <button className="px-2 hover:text-brand" onClick={props.onYearChoose}>
                    {controlDate.year} 年
                </button>
                <button className="px-2 hover:text-brand" onClick={props.onMonthChoose}>
                    {controlDate.month} 月
                </button>
            </DatePickerHead>
            <div className="pt-2 pb-5 px-4 text-xs">
                <div className="border-b grid grid-cols-7">
                    <span className="p-1.5 text-center">日</span>
                    <span className="p-1.5 text-center">一</span>
                    <span className="p-1.5 text-center">二</span>
                    <span className="p-1.5 text-center">三</span>
                    <span className="p-1.5 text-center">四</span>
                    <span className="p-1.5 text-center">五</span>
                    <span className="p-1.5 text-center">六</span>
                </div>
                <div className="grid grid-cols-7">
                    {dates.map((date, i) => (
                        <button
                            key={`${date.year}_${date.month}_${date.date}_${i}`}
                            className={classNames('p-1.5 text-center', {
                                'text-brand': isSameDate(date, currentDate),
                                'hover:text-brand': date.month === controlDate.month && date.date !== controlDate.date,
                                'text-helper': date.month !== controlDate.month,
                            })}
                            onClick={() => onDateChange(date)}
                        >
                            <span
                                className={classNames('inline-block w-6 h-6 leading-6', {
                                    'rounded-full bg-primary text-white': isSameDate(date, activeDate),
                                })}
                            >
                                {date.date}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

interface DatePickerYearProps {
    currentYear: number;
    activeYear: number;
    controlYear: number;
    onYearChange?: (year: number) => void;
}
const DatePickerYear = (props: DatePickerYearProps) => {
    const { controlYear, activeYear, currentYear } = props;

    const [startYear, setStartYear] = useState<number>(Math.floor(controlYear / 10) * 10);

    function onYearChange(dir: 'prev' | 'next') {
        return function () {
            setStartYear((year) => {
                return dir === 'prev' ? year - 10 : year + 10;
            });
        };
    }

    return (
        <>
            <DatePickerHead showArrow={false} onParentPrev={onYearChange('prev')} onParentNext={onYearChange('next')}>
                {startYear}年 - {startYear + 9}年
            </DatePickerHead>
            <div className="pt-2 pb-5 px-4 text-xs h-52 grid grid-cols-4">
                {Array.from({ length: 10 }, (_, i) => startYear + i).map((row) => (
                    <button
                        key={row}
                        className={classNames('hover:text-brand', {
                            'text-brand font-semibold': row === activeYear,
                            'text-brand': row === currentYear,
                        })}
                        onClick={() => (props.onYearChange ? props.onYearChange(row) : undefined)}
                    >
                        {row}
                    </button>
                ))}
            </div>
        </>
    );
};

interface DatePickerMonthProps extends Omit<DatePickerDateProps, 'onDateChange' | 'onControlDateChange'> {
    onYearChange?: (year: number) => void;
    onMonthChange?: (month: number) => void;
    onYearChoose?: () => void;
}
const DatePickerMonth = (props: DatePickerMonthProps) => {
    const { controlDate, activeDate, currentDate } = props;

    function onYearChange(dir: 'prev' | 'next') {
        return function () {
            const year = controlDate.year;
            props.onYearChange && props.onYearChange(dir === 'prev' ? year - 1 : year + 1);
        };
    }

    function onMonthChange(month: number) {
        props.onMonthChange && props.onMonthChange(month);
    }

    return (
        <>
            <DatePickerHead showArrow={false} onParentPrev={onYearChange('prev')} onParentNext={onYearChange('next')}>
                <button onClick={props.onYearChoose}>{controlDate.year} 年</button>
            </DatePickerHead>
            <div className="pt-2 pb-5 px-4 text-xs h-52 grid grid-cols-4">
                {Object.keys(MONTH_PLAIN_TEXT).map((key: string) => (
                    <button
                        key={key}
                        className={classNames('hover:text-brand', {
                            'text-brand font-semibold':
                                controlDate.year === activeDate.year && Number(key) === activeDate.month,
                            'text-brand': controlDate.year === activeDate.year && Number(key) === currentDate.month,
                        })}
                        onClick={() => onMonthChange(+key)}
                    >
                        {MONTH_PLAIN_TEXT[+key]}
                    </button>
                ))}
            </div>
        </>
    );
};

export interface DatePickerProps extends Omit<ComponentContext, 'children'> {
    format?: string;
    valueFormat?: string | 'timestamp';
    value: any;
    size?: ComponentSize;
    placeholder?: string;
    disabled?: boolean;
    onChange?: (v: any) => void;
}
const DatePicker: React.FC<DatePickerProps> = (props) => {
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth() + 1;
    const curDate = now.getDate();

    const currentDate = {
        year: curYear,
        month: curMonth,
        date: curDate,
    };

    const inputRef = useRef<HTMLElement>();
    const pikerContentRef = useRef<HTMLElement>();
    const popRef = useRef<PopupRef | null>(null);

    const { format = 'YYYY-MM-DD', valueFormat = 'timestamp', value, ...extraProps } = props;
    const [step, setStep] = useState<'year' | 'month' | 'date'>('date');

    const modelValue = useMemo(() => {
        return value ? dayjs(value).format(format) : '';
    }, [props.value, props.format]);

    const [controlDate, setControlDate] = useState<DateItem>({
        year: curYear,
        month: curMonth,
        date: curDate,
    });
    const [activeDate, setActiveDate] = useState<DateItem>({
        year: 0,
        month: 0,
        date: 0,
    });

    useClickAway([inputRef.current, pikerContentRef.current], () => {
        popRef.current?.close();
    });

    const onControlDateChange: DatePickerDateProps['onControlDateChange'] = (value, type) => {
        setControlDate((payload) => {
            return {
                ...payload,
                [type]: value,
            };
        });
    };

    const onDateChange: DatePickerDateProps['onDateChange'] = (date) => {
        setActiveDate({ ...date });
        setControlDate({ ...date });

        let res = new Date(date.year, date.month - 1, date.date);
        props.onChange && props.onChange(valueFormat === 'timestamp' ? res.getTime() : dayjs(res).format(valueFormat));
        popRef.current?.close();
    };

    const onYearChange: DatePickerYearProps['onYearChange'] = (year) => {
        onControlDateChange(year, 'year');
        setStep('month');
    };

    const onMonthChange: DatePickerMonthProps['onMonthChange'] = (month) => {
        onControlDateChange(month, 'month');
        setStep('date');
    };

    function onInputFocus() {
        popRef.current?.open();
    }

    function onDatePickerPopShow() {
        let year = curYear;
        let month = curMonth;
        let date = curDate;
        if (value) {
            const dateObj = new Date(value);
            if (isValidDate(dateObj)) {
                year = dateObj.getFullYear();
                month = dateObj.getMonth() + 1;
                date = dateObj.getDate();

                setActiveDate({ year, month, date });
            }
        }

        setControlDate({ year, month, date });
        setStep('date');
    }

    return (
        <div>
            <Popup
                ref={popRef}
                anchorClasses="!block"
                trigger="manual"
                position="bottom-left"
                content={
                    // @ts-ignore
                    <div ref={pikerContentRef} className="min-w-80 bg-content rounded-card dark:bg-content-dark shadow">
                        {step === 'date' ? (
                            <DatePickerDate
                                currentDate={currentDate}
                                controlDate={controlDate}
                                activeDate={activeDate}
                                onDateChange={onDateChange}
                                onControlDateChange={onControlDateChange}
                                onYearChoose={() => setStep('year')}
                                onMonthChoose={() => setStep('month')}
                            />
                        ) : null}
                        {step === 'month' ? (
                            <DatePickerMonth
                                currentDate={currentDate}
                                controlDate={controlDate}
                                activeDate={activeDate}
                                onYearChange={onYearChange}
                                onMonthChange={onMonthChange}
                                onYearChoose={() => setStep('year')}
                            />
                        ) : null}
                        {step === 'year' ? (
                            <DatePickerYear
                                currentYear={currentDate.year}
                                activeYear={activeDate.year}
                                controlYear={controlDate.year}
                                onYearChange={onYearChange}
                            />
                        ) : null}
                    </div>
                }
                show={onDatePickerPopShow}
            >
                <Input
                    // @ts-ignore
                    ref={inputRef}
                    className={props.disabled ? '' : 'border-form-control dark:border-form-control-dark'}
                    placeholder="请选择"
                    readOnly
                    {...extraProps}
                    value={modelValue}
                    prepend={<CalendarIcon size={16} className="text-helper" />}
                    onClick={onInputFocus}
                />
            </Popup>
        </div>
    );
};

DatePicker.displayName = 'DatePicker';
export default DatePicker;

function isSameDate(date: DateItem, _date: DateItem) {
    return date.year === _date.year && date.month === _date.month && date.date === _date.date;
}

function isValidDate(date: any) {
    return dayjs(new Date(date)).isValid();
}
