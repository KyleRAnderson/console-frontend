import React from 'react';
import { HuntWithProperties } from '../../../../models/Hunt';
import GenericPaginated from '../../../GenericPaginated';
import Match from '../../../../models/Match';
import MatchAPI from './matchAPI';
import { PropertyMapping } from '../../../GenericTable';

type Props = {
    hunt: HuntWithProperties;
};

export default function MatchesAdapter(props: Props): JSX.Element {
    async function getMatches(page: number, matchesPerPage?: number): Promise<[Match[], number]> {
        const { data } = await MatchAPI.getMatches(props.hunt, { page: page, per_page: matchesPerPage });
        return [data.matches, data.num_pages];
    }

    const propertyMappings: PropertyMapping<Match>[] = [
        ['First 1', (match) => match.licenses[0].participant.first],
        ['Last 1', (match) => match.licenses[0].participant.last],
        ['First 2', (match) => match.licenses[1].participant.first],
        ['Last 2', (match) => match.licenses[1].participant.last],
    ];

    return <GenericPaginated getValues={getMatches} propertyMappings={propertyMappings} />;
}
