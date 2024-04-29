import { Doc, DocDetail } from '@swai/types';
import { formatTime } from '@/utils/formatTime';
import { RefreshIcon, TimeIcon } from '@swai/icon';

export default function DocBaseInfo({ doc }: { doc: Doc | DocDetail }) {
    return (
        <div className="my-3 text-sm text-helper dark:text-helper-dark">
            <span className="me-5 inline-flex items-center gap-1">
                <RefreshIcon size={18} />
                {formatTime(doc.updated_at)}
            </span>
            <span className="inline-flex items-center gap-1">
                <TimeIcon size={18} />
                {formatTime(doc.created_at)}
            </span>
        </div>
    );
}
