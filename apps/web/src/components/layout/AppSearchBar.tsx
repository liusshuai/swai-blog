import { SearchInput } from '@swai/ui';
import { useRouter } from 'next/navigation';

export default function AppSearchBar(props: { afterSearch?: () => void }) {
    const router = useRouter();
    function onSearch(keyword: string) {
        router.push(`/search?q=${keyword}`);
        props.afterSearch && props.afterSearch();
    }

    return <SearchInput placeholder="输入关键字搜索..." onSearch={onSearch} />;
}
