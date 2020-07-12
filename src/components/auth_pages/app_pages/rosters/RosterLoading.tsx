import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getRoster } from '../../../../api/rosterAPI';
import Roster from '../../../../models/Roster';
import { ROSTER_ID_PARAM } from '../../../../routes/AppPaths';
import GenericLoader from '../../../generics/GenericLoader';

export type Props = {
    onLoad: (roster: Roster) => void;
};

export default function RosterLoading(props: Props): JSX.Element {
    const [failedToLoadRoster, setFailedToLoadRoster] = useState<boolean>(false);
    const { [ROSTER_ID_PARAM]: rosterId } = useParams();
    const history = useHistory();

    if (failedToLoadRoster) {
        history.goBack();
        return <></>;
    }

    return (
        <GenericLoader<Roster>
            loadFunction={() => getRoster(rosterId)}
            onLoaded={(roster) => props.onLoad(roster)}
            onError={() => setFailedToLoadRoster(true)}
        />
    );
}
