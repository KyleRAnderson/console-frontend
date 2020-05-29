import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import AppPaths from '../../../../routes/AppPaths';
import HuntAPI from './huntAPI';
import Notifications from '../../../../notification';
import LicensesAdapter from '../licenses/LicensesAdapter';
import { HuntWithProperties } from '../../../../models/Hunt';

type Props = RouteComponentProps<{ [key: string]: string }> & {
    hunt?: HuntWithProperties;
};

export default function HuntDetails(props: Props): JSX.Element {
    const [participantProperties, setParticipantProperties] = useState<string[] | undefined>(undefined);
    const [failedToLoadHunt, setFailedToLoadHunt] = useState<boolean>(false);

    function loadHunt(huntId: string) {
        HuntAPI.getHunt(huntId)
            .then((response) => setParticipantProperties(response.data.roster.participant_properties))
            .catch(() => {
                Notifications.createNotification({ message: 'Failed to load hunt data.', type: 'danger' });
                setFailedToLoadHunt(true);
            });
    }

    useEffect(() => {
        let loadedProperties: string[] | undefined = props.hunt?.roster.participant_properties;
        if (!loadedProperties) {
            if (props.match.params[AppPaths.huntIdParam]) {
                loadHunt(props.match.params[AppPaths.huntIdParam]);
            } else {
                setFailedToLoadHunt(true);
            }
        }

        if (loadedProperties) {
            setParticipantProperties(loadedProperties);
        }
    }, []);

    if (!participantProperties) {
        return <h1>Loading...</h1>;
    }
    if (failedToLoadHunt) {
        props.history.goBack();
        return <Redirect to={props.history.location} />;
    }

    return (
        <LicensesAdapter
            huntId={props.match.params[AppPaths.huntIdParam]}
            participantProperties={participantProperties}
        />
    );
}
