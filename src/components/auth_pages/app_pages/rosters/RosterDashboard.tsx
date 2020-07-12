import React, { useState } from 'react';
import Hunt, { HuntWithProperties } from '../../../../models/Hunt';
import Roster from '../../../../models/Roster';
import HuntsList from '../hunts/HuntsList';
import ParticipantsView from '../participants/ParticipantsView';

export type Props = {
    roster: Roster;
    onSelectHunt?: (hunt: HuntWithProperties) => void;
};

export default function RosterDashboard(props: Props): JSX.Element {
    const [hunts, setHunts] = useState<Hunt[]>();

    function selectHunt(hunt: Hunt): void {
        props.onSelectHunt?.({ ...hunt, roster: { participant_properties: props.roster.participant_properties } });
    }

    return (
        <>
            <HuntsList
                hunts={hunts}
                onHuntsUpdated={setHunts}
                rosterId={props.roster.id}
                onHuntSelect={(hunt) => selectHunt(hunt)}
            />
            <ParticipantsView hunts={hunts} roster={props.roster} />
        </>
    );
}
