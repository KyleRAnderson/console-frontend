import React from 'react';
import { HuntWithProperties } from '../../../../models/Hunt';
import GenericPaginated from '../../../GenericPaginated';
import Match from '../../../../models/Match';
import { PropertyMapping } from '../../../GenericTable';
import * as MiniSignal from 'mini-signals';
import { getMatches } from '../../../../api/matchAPI';

type Props = {
    hunt: HuntWithProperties;
    matchmakingCompleteSignal?: MiniSignal;
};

export default function MatchesAdapter(props: Props): JSX.Element {
    async function loadMatches(page: number, matchesPerPage?: number): Promise<[Match[], number]> {
        const { data } = await getMatches(props.hunt, { page: page, per_page: matchesPerPage });
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
            updateSignal={props.matchmakingCompleteSignal}
            getValues={loadMatches}
            propertyMappings={propertyMappings}
        />
    );
}
