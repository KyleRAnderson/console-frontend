import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { getMatches, MatchFilters } from '../../../../api/matchAPI';
import { HuntWithProperties } from '../../../../models/Hunt';
import Match from '../../../../models/Match';
import { createNotification } from '../../../../notification';
import GenericTable, { PropertyMapping } from '../../../generics/GenericTable';
import LoadUntilReady from '../../../generics/LoadUntilReady';
import PaginatedElement from '../../../generics/PaginatedElement';

export type Props = {
    hunt: HuntWithProperties;
    filters?: MatchFilters;
    /** True when there are new matches, false otherwise. */
    newMatches?: boolean;
    /** Function to call when matches are loaded. Should be provided if newMatches is provided. */
    onMatchesLoaded?: () => void;
    /** Function to be called when a match is selected. */
    onMatchSelected?: (match: Match) => void;
};

export default function MatchesAdapter(props: Props): JSX.Element {
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [matches, setMatches] = useState<Match[]>();

    function loadMatches(): void {
        getMatches(props.hunt, { page: currentPage }, props.filters)
            .then(({ data: { matches, num_pages: numPages } }) => {
                setNumPages(numPages);
                setMatches(matches);
                props.onMatchesLoaded?.();
            })
            .catch(() => createNotification({ message: 'Failed to load matches', type: 'danger' }));
    }

    // Order of useEffects is important here, need to update the page to 1 before loading again.
    useEffect(() => {
        setCurrentPage(1);
    }, [props.filters]);
    useEffect(loadMatches, [currentPage, props.filters]);
    useEffect(() => {
        if (props.newMatches) {
            loadMatches();
        }
    }, [props.newMatches]);

    const propertyMappings: PropertyMapping<Match>[] = [
        ['First 1', (match) => match.licenses[0]?.participant?.first || ''],
        ['Last 1', (match) => match.licenses[0]?.participant?.last || ''],
        [
            'Actions',
            (match) => {
                return (
                    <td key={`show_${match.id}`} className="text-center">
                        <Button variant="outline-primary" onClick={() => props.onMatchSelected?.(match)}>
                            View
                        </Button>
                    </td>
                );
            },
        ],
        ['First 2', (match) => match.licenses[1]?.participant?.first || ''],
        ['Last 2', (match) => match.licenses[1]?.participant?.last || ''],
    ];

    return (
        <PaginatedElement currentPage={currentPage} numPages={numPages} onSetPage={setCurrentPage}>
            <LoadUntilReady isLoaded={!!matches}>
                <GenericTable<Match> striped propertyMappings={propertyMappings} values={matches as Match[]} />
            </LoadUntilReady>
        </PaginatedElement>
    );
}
