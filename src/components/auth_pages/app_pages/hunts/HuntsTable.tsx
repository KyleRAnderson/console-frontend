import Hunt from '../../../../models/Hunt';
import { ButtonGroup } from 'react-bootstrap';
import React from 'react';
import GenericTable, { PropertyMapping } from '../../../GenericTable';

export type HuntsTableProps = {
    hunts: Hunt[];
    actionButtons?: (hunt: Hunt) => JSX.Element;
};

export default function huntsTable(props: HuntsTableProps): JSX.Element {
    function buttonGroupForHunt(hunt: Hunt): JSX.Element | null {
        let buttonGroup: JSX.Element | null = null;
        if (props.actionButtons) {
            buttonGroup = <ButtonGroup aria-label="action-buttons">{props.actionButtons(hunt)}</ButtonGroup>;
        }
        return buttonGroup;
    }

    const propertyMappings: PropertyMapping<Hunt>[] = [
        ['Name', 'name'],
        ['Active Participants', 'num_active_licenses'],
        ['Actions', buttonGroupForHunt],
    ];

    return <GenericTable<Hunt> propertyMappings={propertyMappings} values={props.hunts} striped responsive />;
}
