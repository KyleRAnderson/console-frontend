import React, { useState } from 'react';
import SearchBar, { Props as SearchBarProps } from './SearchBar';

export type Props = Omit<SearchBarProps, 'setSearchValue' | 'searchValue' | 'onSearch'> & {
    onSearch: (searchTerms: SearchBarProps['searchValue']) => void;
};

/** State holder for the SearchBar component. */
export default function SearchBarHolder(props: Props): JSX.Element {
    const [searchValue, setSearchValue] = useState<string | undefined>();
    return (
        <SearchBar
            {...props}
            onSearch={() => props.onSearch(searchValue)}
            setSearchValue={setSearchValue}
            searchValue={searchValue}
        />
    );
}
