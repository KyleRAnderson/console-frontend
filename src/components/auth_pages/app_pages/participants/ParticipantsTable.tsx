import React from 'react';
import { Table } from 'react-bootstrap';
import Participant from '../../../../models/Participant';

export interface ParticipantsProps {
    participants: Participant[];
    participant_attributes: string[];
}

export default function ParticipantsTable(props: ParticipantsProps): JSX.Element {
    let participant_properties_ordered: string[] = props.participant_attributes.sort();
    return (
        <Table striped responsive>
            <thead className="thead-dark">
                <tr>
                    <th>First</th>
                    <th>Last</th>
                    {participant_properties_ordered.map((attribute, i) => {
                        return <th key={i}>{titleCase(attribute)}</th>;
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
