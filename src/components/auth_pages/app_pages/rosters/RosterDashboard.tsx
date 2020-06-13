import React, { useState, useEffect } from 'react';
import HuntsList from '../hunts/HuntsList';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import Roster from '../../../../models/Roster';
import * as AppPaths from '../../../../routes/AppPaths';
import ParticipantAdapter from '../participants/ParticipantAdapter';
import Hunt, { HuntWithProperties } from '../../../../models/Hunt';
import Loading from '../../../Loading';
import { getRoster } from '../../../../api/rosterAPI';

type Props = RouteComponentProps<{ [key: string]: string }> & {
    roster?: Roster | string;
    onSelectHunt?: (hunt: HuntWithProperties) => void;
};

export default function RosterDashboard(props: Props): JSX.Element {
    const [roster, setRoster] = useState<Roster | undefined>(undefined);
    const [failedToLoadRoster, setFailedToLoadRoster] = useState<boolean>(false);

    function loadRoster(rosterId: string): void {
        getRoster(rosterId)
            .then((response) => {
                setRoster(response.data);
            })
            .catch(() => {
                setFailedToLoadRoster(true);
            });
    }

    function selectHunt(hunt: Hunt): void {
        if (roster) {
            props.onSelectHunt?.({ ...hunt, roster: { participant_properties: roster.participant_properties } });
        }
    }

    useEffect(() => {
        let potentialRoster: Roster | string | undefined;

        // Check the roster prop, as first priority.
        if (props.roster) {
            potentialRoster = props.roster;
        }
        // Then check the URL param.
        else if (props.match.params[AppPaths.rosterIdParam]) {
            potentialRoster = props.match.params[AppPaths.rosterIdParam];
        }

        if (!potentialRoster) {
            setFailedToLoadRoster(true);
        } else if (typeof potentialRoster === 'string') {
            loadRoster(potentialRoster);
        } else {
            setRoster(potentialRoster);
        }
    }, []);

    if (!roster) {
        return <Loading />;
    }
    if (failedToLoadRoster) {
        props.history.goBack();
        return <Redirect to={props.history.location} />;
    }

    return (
        <>
            <HuntsList rosterId={roster.id} onHuntSelect={(hunt) => selectHunt(hunt)} />
            <ParticipantAdapter roster={roster} />
        </>
    );
}
