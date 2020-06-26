import Hunt from '../../../../models/Hunt';
import { ButtonGroup } from 'react-bootstrap';
import React from 'react';
import GenericTable, { PropertyMapping } from '../../../generics/GenericTable';

export type HuntsTableProps = {
    hunts: Hunt[];
    actionButtons?: (hunt: Hunt) => React.ReactNode;
};

export default function HuntsTable(props: HuntsTableProps): JSX.Element {
    function buttonGroupForHunt(hunt: Hunt): React.ReactNode {
        let buttonGroup: React.ReactNode = null;
        if (props.actionButtons) {
            buttonGroup = <ButtonGroup aria-label="action-buttons">{props.actionButtons(hunt)}</ButtonGroup>;
        }
        return <td key={hunt.id}>{buttonGroup}</td>;
    }

    const propertyMappings: PropertyMapping<Hunt>[] = [
        ['Name', 'name'],
        ['Active Participants', 'num_active_licenses'],
        ['Actions', buttonGroupForHunt],
    ];

    return <GenericTable<Hunt> propertyMappings={propertyMappings} values={props.hunts} striped responsive />;
}
