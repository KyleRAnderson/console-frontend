import React, { useState } from 'react';
import { MatchFilters } from '../../../../api/matchAPI';
import MatchesAdapter, { Props as AdapterProps } from './MatchesAdapter';
import MatchFiltersSelector from './MatchFiltersSelector';
import { Container } from 'react-bootstrap';

/**
 * Component for rendering matches along with their filters
 * for easy listing of matches in a table.
 */
export default function MatchesList(props: Omit<AdapterProps, 'filters'>): JSX.Element {
    const [filters, setFilters] = useState<MatchFilters>({ ongoing: true, round: props.hunt.current_round_number });

    return (
        <>
            <Container fluid className="py-1">
                <MatchFiltersSelector
                    setFilters={setFilters}
                    currentFilters={filters}
                    numRounds={props.hunt.current_round_number}
                />
            </Container>
            <MatchesAdapter filters={filters} {...props} />
        </>
    );
}
