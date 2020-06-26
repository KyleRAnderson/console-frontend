import React from 'react';
import Roster from '../../../../models/Roster';
import { ButtonGroup } from 'react-bootstrap';
import GenericTable, { PropertyMapping } from '../../../generics/GenericTable';

export type RosterTableProps = {
    rosters: Roster[];
    actionButtons?: (roster: Roster) => React.ReactNode;
};

export default function rostersTable(props: RosterTableProps) {
    const rosters = props.rosters;

    function buttonGroupForRoster(roster: Roster): React.ReactNode {
        let buttonGroup: React.ReactNode = null;
        if (props.actionButtons) {
            buttonGroup = <ButtonGroup aria-label="action-buttons">{props.actionButtons(roster)}</ButtonGroup>;
        }
        return <td key={roster.id}>{buttonGroup}</td>;
    }

    function renderParticipantProperties(roster: Roster): React.ReactNode {
        return (
            <td key={`${roster.id}_properties`}>
                {roster.participant_properties.map((property: string, index) => {
                    return <li key={index}>{property}</li>;
                })}
            </td>
        );
    }

    const propertyMappings: PropertyMapping<Roster>[] = [
        ['Roster Name', 'name'],
        ['Participant Properties', renderParticipantProperties],
    ];

    if (props.actionButtons) {
        propertyMappings.push(['Actions', buttonGroupForRoster]);
    }

    return <GenericTable<Roster> striped responsive values={rosters} propertyMappings={propertyMappings} />;
}
