import React from 'react';
import { HuntWithProperties } from '../../../../models/Hunt';
import MatchmakeForm from './MatchmakeForm';
import { createNotification } from '../../../../notification';
import { matchmake, MatchmakeParams } from '../../../../api/matchAPI';

export type Props = {
    hunt: HuntWithProperties;
    // Called after a request to matchmake has been submitted.
    onMatchmake?: (matchmakeParams: MatchmakeParams) => void;
};

export default function Matchmake(props: Props): JSX.Element {
    function submitMatchmake(matchmakeParams: MatchmakeParams) {
        matchmake(props.hunt, matchmakeParams);
        createNotification({ type: 'info', message: 'Matchmake request submitted...' });
        props.onMatchmake?.(matchmakeParams);
    }

    return (
        <MatchmakeForm onSubmit={submitMatchmake} participantProperties={props.hunt.roster.participant_properties} />
    );
}
