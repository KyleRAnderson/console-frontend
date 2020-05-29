import React from 'react';
import { Table } from 'react-bootstrap';
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

export default function ParticipantsTable<T extends ParticipantBase>(props: ParticipantsProps<T>): JSX.Element {
    let participant_properties_ordered: string[] = props.participantProperties.sort();
    let propertyMappings: PropertyMapping<T>[] = [
        ['First', 'first'],
        ['Last', 'last'],
        ...participant_properties_ordered.map(
            (property): PropertyMapping<T> => {
                return [property, (participant) => participant.extras[property]];
            },
        ),
    ];
    if (props.extraColumns) {
        propertyMappings.push(...props.extraColumns);
    }
    return <GenericTable striped responsive propertyMappings={propertyMappings} values={props.participants} />;
    return (
        <Table striped responsive>
            <thead className="thead-dark">
                <tr>
                    <th>First</th>
                    <th>Last</th>
                    {participant_properties_ordered.map((attribute, i) => {
                        return <th key={i}>{titleCase(attribute)}</th>;
                    })}
                    {props.extraColumns?.map((column, i) => {
                        return <th key={i}>{column[0]}</th>;
                    })}
                </tr>
            </thead>
            <tbody>
                {props.participants.map((participant, i) => {
                    return (
                        <tr key={i}>
                            <td>{participant.first}</td>
                            <td>{participant.last}</td>
                            {participant_properties_ordered.map((property, j) => {
                                return <td key={j}>{participant.extras[property]}</td>;
                            })}
                            {props.extraColumns?.map((column) => {
                                return <td key={i}>{column[1](participant)}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}

function titleCase(word: string): string {
    let splitWord: string[] = word.trim().split(/\s+/);
    let newWord: string[] = splitWord.map((current) => {
        return current[0].toUpperCase() + current.substring(1);
    });
    return newWord.join(' ');
}
