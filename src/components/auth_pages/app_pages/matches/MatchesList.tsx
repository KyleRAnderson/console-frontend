import React, { useState, useEffect, useRef } from 'react';
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
    const previousRound = useRef<number>(props.hunt.current_round_number);

    useEffect(() => {
        if (props.hunt.current_round_number !== previousRound.current) {
            const currentFiltersCopy = { ...filters };
            const newRound = props.hunt.current_round_number;
            if (!currentFiltersCopy.round) {
                currentFiltersCopy.round = newRound;
            } else if (Array.isArray(currentFiltersCopy.round)) {
                currentFiltersCopy.round.push(newRound);
            } else {
                currentFiltersCopy.round = [currentFiltersCopy.round, newRound];
            }
            setFilters(currentFiltersCopy);
            previousRound.current = props.hunt.current_round_number;
        }
    }, [props.hunt]);

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
