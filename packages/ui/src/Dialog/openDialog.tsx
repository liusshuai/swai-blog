'use client'
import React from 'react';
import { createRoot } from 'react-dom/client';
import Dialog, { DialogProps } from './Dialog';
import ConfirmDialog, { ConfirmDialogProps } from './ConfirmDialog';
import { Func } from '../types/CommonUtils';

export type DialogType = 'default' | 'confirm' | 'alert';

interface CommonEvevnts {
    onBeforeClose?: Func<Func>;
}
type ConfirmDialogOptions = Omit<ConfirmDialogProps, 'open' | 'onClose'> & CommonEvevnts;
export interface DialogOptions extends Omit<DialogProps, 'open' | 'onClose'>, CommonEvevnts {
    type?: DialogType;
}

let renderTimer: any;
export function openDialog(options: DialogOptions | ConfirmDialogOptions) {

    const container = document.createDocumentFragment();
    document.body.append(container);

    const root = createRoot(container);

    const isConfirm = (options as DialogOptions).type === 'confirm';
    const Node = isConfirm ? ConfirmDialog : Dialog;

    const mergedOptions: any = { ...options, open: true, onClose, onAfterClose };

    function doClose() {
        mergedOptions.open = false;
        root.render(<Node {...mergedOptions} />);
    }
    
    function onClose() {
        if (options.onBeforeClose) {
            options.onBeforeClose(doClose);
        } else {
            doClose();
        }
    }

    function onAfterClose() {
        setTimeout(() => {
            root.unmount();
            options.onAfterClose && options.onAfterClose();
        });
    }

    async function onCancel() {
        const cancel = (options as ConfirmDialogOptions).onCancel as Func<Func>;
        if (cancel) {
            try {
                await cancel(doClose);
            } catch {}
        } else {
            doClose();
        }
    }

    async function onConfirm() {
        const confirm = (options as ConfirmDialogOptions).onConfirm as Func<Func>;
        if (confirm) {
            try {
                await confirm(doClose);
            } catch {}
        } else {
            doClose();
        }
    }

    function render() {
        renderTimer && clearTimeout(renderTimer);

        renderTimer = setTimeout(() => {

            if (isConfirm) {
                mergedOptions.onCancel = onCancel;
        
                mergedOptions.onConfirm = onConfirm;
            }

            root.render(<Node {...mergedOptions} />);
        });
    }

    render();
}

export const openConfirmDialog = (options: ConfirmDialogOptions) => openDialog({
    type: 'confirm',
    ...options,
});
