import React from 'react';
import HuntsList from '../hunts/HuntsList';
import Roster from '../../../../models/Roster';
import ParticipantsView from '../participants/ParticipantsView';
import Hunt, { HuntWithProperties } from '../../../../models/Hunt';

export type Props = {
    roster: Roster;
    onSelectHunt?: (hunt: HuntWithProperties) => void;
};

export default function RosterDashboard(props: Props): JSX.Element {
    function selectHunt(hunt: Hunt): void {
        props.onSelectHunt?.({ ...hunt, roster: { participant_properties: props.roster.participant_properties } });
    }

    return (
        <>
            <HuntsList rosterId={props.roster.id} onHuntSelect={(hunt) => selectHunt(hunt)} />
            <ParticipantsView roster={props.roster} />
        </>
    );
}
