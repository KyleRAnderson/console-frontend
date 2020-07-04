import React from 'react';
import { HuntWithProperties } from '../../../../models/Hunt';
import GenericPaginated, { Props as GenericPaginatedProps } from '../../../generics/GenericPaginated';
import Match from '../../../../models/Match';
import { PropertyMapping } from '../../../generics/GenericTable';
import { getMatches } from '../../../../api/matchAPI';

type Props = Pick<GenericPaginatedProps<Match>, 'updateSignal'> & {
    hunt: HuntWithProperties;
};

export default function MatchesAdapter(props: Props): JSX.Element {
    async function loadMatches(page: number, matchesPerPage?: number): Promise<[Match[], number]> {
        const data = await getMatches(props.hunt, { page: page, per_page: matchesPerPage });
        return [data.matches, data.num_pages];
    }

    const propertyMappings: PropertyMapping<Match>[] = [
        ['First 1', (match) => match.licenses[0].participant.first],
        ['Last 1', (match) => match.licenses[0].participant.last],
        ['First 2', (match) => match.licenses[1].participant.first],
        ['Last 2', (match) => match.licenses[1].participant.last],
    ];

    return (
        <GenericPaginated
            updateSignal={props.updateSignal}
            getValues={loadMatches}
            propertyMappings={propertyMappings}
        />
    );
}
