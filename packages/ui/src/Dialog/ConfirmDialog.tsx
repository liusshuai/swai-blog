import React from 'react';
import type { DialogProps } from './Dialog';
import Dialog from './Dialog';
import Button from '../Button';

export interface ConfirmDialogProps extends Omit<DialogProps, 'actions'> {
    cancelText?: string;
    confirmText?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {

    const { title = '提示', cancelText = '取消', confirmText = '确定', children, onCancel, onConfirm, ...extraProps } = props;

    return <Dialog {...extraProps} title={title} actions={
        <div className="flex justify-center gap-5 mt-5">
            <Button size='medium' color='secondary' onClick={onCancel}>{ cancelText }</Button>
            <Button size='medium' onClick={onConfirm}>{ confirmText }</Button>
        </div>
    }>
        { children }
    </Dialog>
}

ConfirmDialog.displayName = 'ConfirmDialog';
export default ConfirmDialog;
