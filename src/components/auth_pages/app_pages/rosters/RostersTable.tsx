import React from 'react';
import Roster from '../../../../models/Roster';
import { Table, ButtonGroup } from 'react-bootstrap';

export type RosterTableProps = {
    rosters: Roster[];
    actionButtons?: (roster: Roster) => JSX.Element;
};

export default function rostersTable(props: RosterTableProps) {
    const rosters = props.rosters;

    function buttonGroupForRoster(roster: Roster): JSX.Element | null {
        let buttonGroup: JSX.Element | null = null;
        if (props.actionButtons) {
            buttonGroup = (
                <td>
                    <ButtonGroup aria-label="action-buttons">{props.actionButtons(roster)}</ButtonGroup>
                </td>
            );
        }
        return buttonGroup;
    }

    return (
        <Table striped responsive>
            <thead className="thead-dark">
                <tr>
                    <th scope="col">Roster Name</th>
                    <th scope="col">Participant Properties</th>
                    {props.actionButtons ? <th scope="col"></th> : null}
                </tr>
            </thead>
            <tbody>
                {rosters.map((roster: Roster) => {
                    return (
                        <tr key={roster.id} className="">
                            <td>{roster.name}</td>
                            <td>
                                <ul>
                                    {roster.participant_properties.map((property: string, index) => {
                                        return <li key={index}>{property}</li>;
                                    })}
                                </ul>
                            </td>
                            {buttonGroupForRoster(roster)}
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}
