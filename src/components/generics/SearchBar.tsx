import React from 'react';
import { Form } from 'react-bootstrap';
import FormControlElement from '../../FormControlElement';

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
    let delayTimer: NodeJS.Timeout | undefined;
    function handleChange(event: React.ChangeEvent<FormControlElement>): void {
        delayTimer && clearTimeout(delayTimer);
        const value = event.target.value.length > 0 ? event.target.value : undefined;
        delayTimer = setTimeout(() => props.onSearch(value), SEARCH_DELAY);
    }

    return <Form.Control type="text" placeholder="Search" onChange={handleChange} />;
}
