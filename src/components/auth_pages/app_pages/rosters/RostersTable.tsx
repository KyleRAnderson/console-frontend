import React from 'react';
import Roster from '../../../../models/Roster';
import * as appPaths from '../../../../routes/AppLocations';
import { Button, Table } from 'react-bootstrap';

export interface RosterTableProps {
    rosters: Roster[];
}

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
                                    <Button variant="outline-secondary" href={`${appPaths.rostersPath}/${roster.id}`}>
                                        View
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </>
    );
}
