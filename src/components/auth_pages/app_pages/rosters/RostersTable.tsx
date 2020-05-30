import React from 'react';
import Roster from '../../../../models/Roster';
import { ButtonGroup } from 'react-bootstrap';
import GenericTable, { PropertyMapping } from '../../../GenericTable';

export type RosterTableProps = {
    rosters: Roster[];
    actionButtons?: (roster: Roster) => JSX.Element;
};

export default function rostersTable(props: RosterTableProps) {
    const rosters = props.rosters;

    function buttonGroupForRoster(roster: Roster): JSX.Element | null {
        let buttonGroup: JSX.Element | null = null;
        if (props.actionButtons) {
            buttonGroup = <ButtonGroup aria-label="action-buttons">{props.actionButtons(roster)}</ButtonGroup>;
        }
        return <td key={roster.id}>{buttonGroup}</td>;
    }

    function formatParticipantProperties(roster: Roster): JSX.Element {
        return (
            <>
                {roster.participant_properties.map((property: string, index) => {
                    return <li key={index}>{property}</li>;
                })}
            </>
        );
    }

    const propertyMappings: PropertyMapping<Roster>[] = [
        ['Roster Name', 'name'],
        ['Participant Properties', formatParticipantProperties],
    ];

    if (props.actionButtons) {
        propertyMappings.push(['Actions', buttonGroupForRoster]);
    }

    return <GenericTable<Roster> striped responsive values={rosters} propertyMappings={propertyMappings} />;
}
