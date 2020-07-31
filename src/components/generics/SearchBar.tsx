import React, { useRef } from 'react';
import { Form } from 'react-bootstrap';
import FormControlElement from '../../FormControlElement';

/** Time in milliseconds to delay before actually searching. */
const SEARCH_DELAY = 750;

export type Props = Omit<React.ComponentProps<typeof Form.Control>, 'type' | 'onChange' | 'value'> & {
    /** Value to be searched on. */
    onSearch: (value: string) => void;
    /** The current value in the search bar. */
    searchValue: string;
    setSearchValue: (newValue: string) => void;
};

/**
 * Basic search bar with an included delay on search.
 */
export default function SearchBar({ onSearch, searchValue, setSearchValue, ...controlProps }: Props): JSX.Element {
    const delayTimer = useRef<NodeJS.Timeout | undefined>();
    function handleChange(event: React.ChangeEvent<FormControlElement>): void {
        delayTimer.current && clearTimeout(delayTimer.current);
        const value = event.target.value;

        // Important that we pass the value here instead of in SearchBarHolder for instance, since it would still have the old value.
        // Other option would be to set up the timeout in a useEffect, but that's just lame.
        setSearchValue(value);
        delayTimer.current = global.setTimeout(() => onSearch(value), SEARCH_DELAY);
    }

    return (
        <Form.Control type="text" placeholder="Search" onChange={handleChange} value={searchValue} {...controlProps} />
    );
}
