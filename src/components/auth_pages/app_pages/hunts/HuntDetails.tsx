import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import * as AppPaths from '../../../../routes/AppPaths';
import { createNotification } from '../../../../notification';
import { HuntWithProperties } from '../../../../models/Hunt';
import Loading from '../../../Loading';
import HuntNavigator from './HuntNavigator';
import HuntSubscriptionHolder from './HuntSubscriptionHolder';
import MiniSignal from 'mini-signals';
import { getHunt } from '../../../../api/huntAPI';

type Props = RouteComponentProps<{ [key: string]: string }> & {
    hunt?: HuntWithProperties;
};

export default function HuntDetails(props: Props): JSX.Element {
    const [currentHunt, setCurrentHunt] = useState<HuntWithProperties | undefined>(undefined);
    const [failedToLoadHunt, setFailedToLoadHunt] = useState<boolean>(false);

    function loadHunt(huntId: string) {
        getHunt(huntId)
            .then(({ data }) => setCurrentHunt(data))
            .catch(() => {
                createNotification({ message: 'Failed to load hunt data.', type: 'danger' });
                setFailedToLoadHunt(true);
            });
    }

    useEffect(() => {
        const loadedHunt: HuntWithProperties | undefined = props.hunt;
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

    function getNavigator(notificationSignal: MiniSignal): React.ReactNode {
        return currentHunt ? (
            <HuntNavigator currentHunt={currentHunt} matchmakingCompleteSignal={notificationSignal} {...props} />
        ) : null;
    }

    return <HuntSubscriptionHolder hunt={currentHunt}>{getNavigator}</HuntSubscriptionHolder>;
}
