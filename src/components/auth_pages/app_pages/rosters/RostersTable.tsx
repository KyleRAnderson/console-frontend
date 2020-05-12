import React from 'react';
import Roster from '../../../../models/Roster';
import AppPaths from '../../../../routes/AppPaths';
import { Button, Table, ButtonGroup } from 'react-bootstrap';

export type RosterTableProps = {
    rosters: Roster[];
    onDeleteRoster?: (rosterToDelete: Roster) => void;
};

export default function rostersTable(props: RosterTableProps) {
    const rosters = props.rosters;

    return (
        <>
            <Table striped responsive>
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Roster Name</th>
                        <th scope="col">Participant Properties</th>
                        <th scope="col"></th>
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
                                <td>
                                    <ButtonGroup aria-label="action-buttons">
                                        <Button
                                            variant="outline-secondary"
                                            type="button"
                                            href={AppPaths.rosterPath(roster.id)}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            type="button"
                                            onClick={() => props.onDeleteRoster?.(roster)}
                                        >
                                            Delete
                                        </Button>
                                    </ButtonGroup>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </>
    );
}
