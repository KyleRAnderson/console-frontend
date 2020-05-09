import React from 'react';
import { Table } from 'react-bootstrap';
import Participant from '../../../../models/Participant';

export interface ParticipantsProps {
    participants: Participant[];
    participant_attributes: string[];
}

export default function participantsTable(props: ParticipantsProps) {
    let participant_properties_ordered: string[] = props.participant_attributes.sort();
    return (
        <Table striped responsive>
            <thead>
                <th>First</th>
                <th>Last</th>
                {participant_properties_ordered.map((attribute) => {
                    <th>{titleCase(attribute)}</th>;
                })}
            </thead>
            <tbody>
                {props.participants.map((participant) => {
                    return (
                        <tr>
                            <td>{participant.first}</td>
                            <td>{participant.last}</td>
                            {participant_properties_ordered.map((property) => {
                                return <td>{participant.extras[property]}</td>;
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
