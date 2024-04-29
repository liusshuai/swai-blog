'use client';
import React, { FormEvent, KeyboardEvent, useState } from 'react';
import type { InputProps } from '../Input/Input';
import Input from '../Input/Input';
import { SearchIcon } from '@swai/icon';

export interface SearchInputProps extends InputProps {
    onSearch?: (keyword: string) => void;
}
const SearchInput: React.FC<SearchInputProps> = (props) => {
    const [keyword, setKeyword] = useState<string>((props.value as string) || '');

    function onInput(e: FormEvent<HTMLInputElement>) {
        setKeyword((e.target as HTMLInputElement).value);
    }

    const { onSearch, ...extraProps } = props;

    function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key.toLocaleLowerCase() === 'enter') {
            onSearch && onSearch(keyword);
        }
    }

    return (
        <Input
            round
            {...extraProps}
            value={keyword}
            prepend={<SearchIcon size={20} />}
            onInput={onInput}
            onKeyDown={onKeyDown}
        />
    );
};

SearchInput.displayName = 'SearchInput';
export default SearchInput;
