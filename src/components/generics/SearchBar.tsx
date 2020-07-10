import React from 'react';
import { FormControl } from 'react-bootstrap';

/** Time in milliseconds to delay before actually searching. */
const SEARCH_DELAY = 750;

export type Props = {
    /** Value to be searched on. */
    onSearch: (searchText: string | undefined) => void;
};

/**
 * Basic search bar with an included delay on search.
 */
export default function SearchBar(props: Props): JSX.Element {
    let delayTimer: NodeJS.Timeout;
    function handleChange(
        event: Parameters<NonNullable<React.ComponentProps<typeof FormControl>['onChange']>>[0],
    ): void {
        clearTimeout(delayTimer);
        const value = event.target.value.length > 0 ? event.target.value : undefined;
        delayTimer = setTimeout(() => props.onSearch(value), SEARCH_DELAY);
    }

    return <FormControl type="text" placeholder="Search" onChange={handleChange} />;
}
