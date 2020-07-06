import React, { useEffect, useState } from 'react';
import { getMatches } from '../../../../api/matchAPI';
import { HuntWithProperties } from '../../../../models/Hunt';
import Match from '../../../../models/Match';
import { Props as GenericPaginatedProps } from '../../../generics/GenericPaginated';
import GenericTable, { PropertyMapping } from '../../../generics/GenericTable';
import PaginatedElement from '../../../generics/PaginatedElement';
import LoadUntilReady from '../../../generics/LoadUntilReady';
import { createNotification } from '../../../../notification';

type Props = Pick<GenericPaginatedProps<Match>, 'updateSignal'> & {
    hunt: HuntWithProperties;
};

export default function MatchesAdapter(props: Props): JSX.Element {
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [matches, setMatches] = useState<Match[]>();

    function loadMatches(): void {
        getMatches(props.hunt, { page: currentPage })
            .then(({ matches, num_pages: numPages }) => {
                setNumPages(numPages);
                setMatches(matches);
            })
            .catch(() => createNotification({ message: 'Failed to load matches', type: 'danger' }));
    }

    props.updateSignal?.add(loadMatches);
    useEffect(loadMatches, [currentPage]);

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
