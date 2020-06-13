import React from 'react';
import { ParticipantBase } from '../../../../models/Participant';
import GenericTable, { PropertyMapping } from '../../../GenericTable';

export type ParticipantsProps<T extends ParticipantBase> = {
    participants: T[];
    participantProperties: string[];
    /* Any sort of special rendering for extra columns. First entry in the tuple
     * is the <th> to go with the column, second entry is a function that takes the participant
     * and transforms it into the column entry. Extra columns go after participant properties by default.
     */
    extraColumns?: [string, (participant: T) => string][];
};

function titleCase(word: string): string {
    const splitWord: string[] = word.trim().split(/\s+/);
    const newWord: string[] = splitWord.map((current) => {
        return current[0].toUpperCase() + current.substring(1);
    });
    return newWord.join(' ');
}

export default function ParticipantsTable<T extends ParticipantBase>(props: ParticipantsProps<T>): JSX.Element {
    const participant_properties_ordered: string[] = props.participantProperties.sort();
    const propertyMappings: PropertyMapping<T>[] = [
        ['First', 'first'] as PropertyMapping<T>,
        ['Last', 'last'] as PropertyMapping<T>,
        ...participant_properties_ordered.map(
            (property): PropertyMapping<T> => {
                return [titleCase(property), (participant) => participant.extras[property]];
            },
        ),
    ];
    if (props.extraColumns) {
        propertyMappings.push(...props.extraColumns);
    }
    return <GenericTable striped responsive propertyMappings={propertyMappings} values={props.participants} />;
}
