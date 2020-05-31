import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import AppPaths from '../../../../routes/AppPaths';
import HuntAPI from '../../../../api/huntAPI';
import Notifications from '../../../../notification';
import { HuntWithProperties } from '../../../../models/Hunt';
import Loading from '../../../Loading';
import HuntNavigator from './HuntNavigator';

type Props = RouteComponentProps<{ [key: string]: string }> & {
    hunt?: HuntWithProperties;
};

export default function HuntDetails(props: Props): JSX.Element {
    const [currentHunt, setCurrentHunt] = useState<HuntWithProperties | undefined>(undefined);
    const [failedToLoadHunt, setFailedToLoadHunt] = useState<boolean>(false);

    function loadHunt(huntId: string) {
        HuntAPI.getHunt(huntId)
            .then(({ data }) => setCurrentHunt(data))
            .catch(() => {
                Notifications.createNotification({ message: 'Failed to load hunt data.', type: 'danger' });
                setFailedToLoadHunt(true);
            });
    }

    useEffect(() => {
        let loadedHunt: HuntWithProperties | undefined = props.hunt;
        if (!loadedHunt) {
            if (props.match.params[AppPaths.huntIdParam]) {
                loadHunt(props.match.params[AppPaths.huntIdParam]);
            } else {
                setFailedToLoadHunt(true);
            }
        }

        if (loadedHunt) {
            setCurrentHunt(loadedHunt);
        }
    }, []);

    if (!currentHunt) {
        return <Loading />;
    }
    if (failedToLoadHunt) {
        props.history.goBack();
        return <Redirect to={props.history.location} />;
    }

    return <HuntNavigator currentHunt={currentHunt} {...props} />;
}
