import React, { useState } from 'react';
import { matchmake, MatchmakeParams } from '../../../../api/matchAPI';
import { HuntWithProperties } from '../../../../models/Hunt';
import { createNotification } from '../../../../notification';
import MatchmakeForm from './MatchmakeForm';

export type Props = {
    hunt: HuntWithProperties;
    /** Called after a request to matchmake has succeeded. */
    onMatchmake?: (matchmakeParams: MatchmakeParams) => void;
};

export default function Matchmake(props: Props): JSX.Element {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    function submitMatchmake(matchmakeParams: MatchmakeParams) {
        setIsSubmitting(true);
        matchmake(props.hunt, matchmakeParams)
            .finally(() => setIsSubmitting(false))
            .then(() => {
                createNotification({ type: 'info', message: 'Matchmake request submitted...' });
                props.onMatchmake?.(matchmakeParams);
            })
            .catch(() => {
                createNotification({ type: 'danger', message: 'Failed to matchmake' });
            });
    }

    return (
        <MatchmakeForm
            disabled={isSubmitting}
            onSubmit={submitMatchmake}
            participantProperties={props.hunt.roster.participant_properties}
        />
    );
}
