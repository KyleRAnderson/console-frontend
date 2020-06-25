import { RouteComponentProps, Redirect } from 'react-router-dom';

import React, { useState, useEffect } from 'react';
import Roster from '../../../../models/Roster';
import Loading from '../../../Loading';
import { ROSTER_ID_PARAM } from '../../../../routes/AppPaths';
import { getRoster } from '../../../../api/rosterAPI';

export type Props = RouteComponentProps<{ [ROSTER_ID_PARAM]: string }> & {
    onLoad: (roster: Roster) => void;
};

export default function RosterLoading(props: Props): JSX.Element {
    const [failedToLoadRoster, setFailedToLoadRoster] = useState<boolean>(false);

    function loadRoster(rosterId: string): void {
        getRoster(rosterId)
            .then((response) => {
                props.onLoad(response.data);
            })
            .catch(() => {
                setFailedToLoadRoster(true);
            });
    }

    useEffect(() => {
        loadRoster(props.match.params[ROSTER_ID_PARAM]);
    }, []);

    if (failedToLoadRoster) {
        props.history.goBack();
        return <Redirect to={props.history.location} />;
    }

    return <Loading />;
}
