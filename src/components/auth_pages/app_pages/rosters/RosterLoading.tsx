import { RouteComponentProps } from 'react-router-dom';

import React, { useState } from 'react';
import Roster from '../../../../models/Roster';
import { ROSTER_ID_PARAM } from '../../../../routes/AppPaths';
import { getRoster } from '../../../../api/rosterAPI';
import GenericLoader from '../../../generics/GenericLoader';

export type Props = RouteComponentProps<{ [ROSTER_ID_PARAM]: string }> & {
    onLoad: (roster: Roster) => void;
};

export default function RosterLoading(props: Props): JSX.Element {
    const [failedToLoadRoster, setFailedToLoadRoster] = useState<boolean>(false);

    if (failedToLoadRoster) {
        props.history.goBack();
        return <></>;
    }

    return (
        <GenericLoader<Roster>
            loadFunction={() => getRoster(props.match.params[ROSTER_ID_PARAM])}
            onLoaded={(roster) => props.onLoad(roster)}
            onError={() => setFailedToLoadRoster(true)}
        />
    );
}
