import Hunt from '../../../../models/Hunt';
import { ButtonGroup, Table } from 'react-bootstrap';
import React from 'react';

export type HuntsTableProps = {
    hunts: Hunt[];
    actionButtons?: (hunt: Hunt) => JSX.Element;
};

export default function huntsTable(props: HuntsTableProps): JSX.Element {
    function buttonGroupForHunt(hunt: Hunt): JSX.Element | null {
        let buttonGroup: JSX.Element | null = null;
        if (props.actionButtons) {
            buttonGroup = (
                <td>
                    <ButtonGroup aria-label="action-buttons">{props.actionButtons(hunt)}</ButtonGroup>
                </td>
            );
        }
        return buttonGroup;
    }

    return (
        <Table striped responsive>
            <thead className="thead-dark">
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Active Participants</th>
                    {props.actionButtons ? <th scope="col">Actions</th> : null}
                </tr>
            </thead>
            <tbody>
                {props.hunts.map((hunt) => {
                    return (
                        <tr key={hunt.id}>
                            <td>{hunt.name}</td>
                            <td>{hunt.num_active_licenses}</td>
                            {buttonGroupForHunt(hunt)}
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}
