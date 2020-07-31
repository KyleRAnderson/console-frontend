import React, { useRef } from 'react';
import { Form } from 'react-bootstrap';
import FormControlElement from '../../FormControlElement';

/** Time in milliseconds to delay before actually searching. */
const SEARCH_DELAY = 750;

export type Props = Omit<React.ComponentProps<typeof Form.Control>, 'type' | 'onChange' | 'value'> & {
    /** Value to be searched on. */
    onSearch: () => void;
    /** The current value in the search bar. */
    searchValue: string | undefined;
    setSearchValue: (newValue: string | undefined) => void;
};

/**
 * Basic search bar with an included delay on search.
 */
export default function SearchBar({ onSearch, searchValue, setSearchValue, ...controlProps }: Props): JSX.Element {
    const delayTimer = useRef<NodeJS.Timeout | undefined>();
    function handleChange(event: React.ChangeEvent<FormControlElement>): void {
        delayTimer.current && clearTimeout(delayTimer.current);
        const value = event.target.value.length > 0 ? event.target.value : undefined;
        delayTimer.current = global.setTimeout(onSearch, SEARCH_DELAY);
        setSearchValue(value);
    }

    return (
        <Form.Control type="text" placeholder="Search" onChange={handleChange} value={searchValue} {...controlProps} />
    );
}
