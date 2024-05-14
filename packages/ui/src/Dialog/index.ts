import Dialog from './Dialog';
import ConfirmDialog from './ConfirmDialog';

(Dialog as any).Confirm = ConfirmDialog;

export default Dialog as typeof Dialog & {
    Confirm: typeof ConfirmDialog;
};
