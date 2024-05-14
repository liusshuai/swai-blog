'use client';

import React, { useState } from 'react';
import type { DialogProps } from './Dialog';
import Dialog from './Dialog';
import Button from '../Button';
import { Func, FuncWithoutParams } from '../types/CommonUtils';

export interface ConfirmDialogProps extends Omit<DialogProps, 'actions'> {
    cancelText?: string;
    confirmText?: string;
    onCancel?: Func<FuncWithoutParams> | FuncWithoutParams;
    onConfirm?: Func<FuncWithoutParams> | FuncWithoutParams;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
    const {
        title = '提示',
        cancelText = '取消',
        confirmText = '确定',
        children,
        onCancel,
        onConfirm,
        ...extraProps
    } = props;

    const [loading, setLoading] = useState<boolean>(false);

    async function doLikePromise(func?: FuncWithoutParams<void | Promise<any>>) {
        if (func) {
            const res = func();
            if ((res as Promise<any>).then) {
                setLoading(true);
                (res as Promise<any>).finally(() => {
                    setLoading(false);
                });
            }
        }
    }

    const doCancel = () => doLikePromise(onCancel as FuncWithoutParams<void | Promise<any>>);
    const doConfirm = () => doLikePromise(onConfirm as FuncWithoutParams<void | Promise<any>>);

    return (
        <Dialog
            {...extraProps}
            title={title}
            actions={
                <div className="flex justify-center gap-5 mt-5">
                    <Button size="medium" disabled={loading} color="secondary" onClick={doCancel}>
                        {cancelText}
                    </Button>
                    <Button size="medium" loading={loading} onClick={doConfirm}>
                        {confirmText}
                    </Button>
                </div>
            }
        >
            {children}
        </Dialog>
    );
};

ConfirmDialog.displayName = 'ConfirmDialog';
export default ConfirmDialog;
