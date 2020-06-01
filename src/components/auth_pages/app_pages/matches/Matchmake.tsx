import React from 'react';
import { HuntWithProperties } from '../../../../models/Hunt';
import MatchmakeForm from './MatchmakeForm';
import MatchAPI from '../../../../api/matchAPI';
import Notifications from '../../../../notification';

type Props = {
    hunt: HuntWithProperties;
    // Called after a request to matchmake has been submitted.
    onMatchmake?: (matchmakeParams: MatchAPI.MatchmakeParams) => void;
};

export default function Matchmake(props: Props): JSX.Element {
    function submitMatchmake(matchmakeParams: MatchAPI.MatchmakeParams) {
        MatchAPI.matchmake(props.hunt, matchmakeParams);
        Notifications.createNotification({ type: 'info', message: 'Matchmake request submitted...' });
        props.onMatchmake?.(matchmakeParams);
    }

    return (
        <MatchmakeForm onSubmit={submitMatchmake} participantProperties={props.hunt.roster.participant_properties} />
    );
}
