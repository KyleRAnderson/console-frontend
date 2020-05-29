import React, { useState, useEffect } from 'react';
import Hunts from '../hunts/Hunts';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import Roster from '../../../../models/Roster';
import AppPaths from '../../../../routes/AppPaths';
import RosterAPI from './rosterAPI';
import ParticipantAdapter from '../participants/ParticipantAdapter';
import Hunt, { HuntWithProperties } from '../../../../models/Hunt';

type Props = RouteComponentProps<{ [key: string]: string }> & {
    roster?: Roster | string;
    onSelectHunt?: (hunt: HuntWithProperties) => void;
};

export default function RosterDashboard(props: Props): JSX.Element {
    const [roster, setRoster] = useState<Roster | undefined>(undefined);
    const [failedToLoadRoster, setFailedToLoadRoster] = useState<boolean>(false);

    function loadRoster(rosterId: string): void {
        RosterAPI.getRoster(rosterId)
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
        return <h1>Loading...</h1>;
    }
    if (failedToLoadRoster) {
        props.history.goBack();
        return <Redirect to={props.history.location} />;
    }

    return (
        <>
            <Hunts rosterId={roster.id} onHuntSelect={(hunt) => selectHunt(hunt)} />
            <ParticipantAdapter roster={roster} />
        </>
    );
}
