import React, { useEffect, useState } from 'react';
import { getMatches, MatchFilters } from '../../../../api/matchAPI';
import { HuntWithProperties } from '../../../../models/Hunt';
import Match from '../../../../models/Match';
import { Props as GenericPaginatedProps } from '../../../generics/GenericPaginated';
import GenericTable, { PropertyMapping } from '../../../generics/GenericTable';
import PaginatedElement from '../../../generics/PaginatedElement';
import LoadUntilReady from '../../../generics/LoadUntilReady';
import { createNotification } from '../../../../notification';

export type Props = Pick<GenericPaginatedProps<Match>, 'updateSignal'> & {
    hunt: HuntWithProperties;
    filters?: MatchFilters;
};

export default function MatchesAdapter(props: Props): JSX.Element {
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [matches, setMatches] = useState<Match[]>();

    function loadMatches(): void {
        getMatches(props.hunt, { page: currentPage }, props.filters)
            .then(({ matches, num_pages: numPages }) => {
                setNumPages(numPages);
                setMatches(matches);
            })
            .catch(() => createNotification({ message: 'Failed to load matches', type: 'danger' }));
    }

    props.updateSignal?.add(loadMatches);
    // Order of useEffects is important here, need to update the page to 1 before loading again.
    useEffect(() => {
        setCurrentPage(1);
    }, [props.filters]);
    useEffect(loadMatches, [currentPage, props.filters]);

    const propertyMappings: PropertyMapping<Match>[] = [
        ['First 1', (match) => match.licenses[0]?.participant?.first || ''],
        ['Last 1', (match) => match.licenses[0]?.participant?.last || ''],
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
