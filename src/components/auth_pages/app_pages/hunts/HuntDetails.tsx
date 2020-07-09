import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as AppPaths from '../../../../routes/AppPaths';
import { createNotification } from '../../../../notification';
import { HuntWithProperties } from '../../../../models/Hunt';
import HuntNavigator from './HuntNavigator';
import HuntSubscriptionHolder from './HuntSubscriptionHolder';
import MiniSignal from 'mini-signals';
import { getHunt } from '../../../../api/huntAPI';
import BlockLoader from '../../../generics/BlockLoader';

type Props = RouteComponentProps<{ [AppPaths.HUNT_ID_PARAM]: string }> & {
    hunt?: HuntWithProperties;
};

export default function HuntDetails(props: Props): JSX.Element {
    const [currentHunt, setCurrentHunt] = useState<HuntWithProperties | undefined>(props.hunt);

    function loadHunt(): Promise<HuntWithProperties> {
        return getHunt(props.match.params[AppPaths.HUNT_ID_PARAM]);
    }

    function onError(): void {
        createNotification({ message: 'Failed to load hunt data.', type: 'danger' });
        props.history.goBack();
    }

    function handleHuntUpdated(newHuntProperties?: Partial<HuntWithProperties>): void {
        if (currentHunt && newHuntProperties) {
            setCurrentHunt({ ...currentHunt, ...newHuntProperties });
        }
    }

    function getNavigator(notificationSignal: MiniSignal): React.ReactNode {
        return currentHunt ? (
            <HuntNavigator
                onHuntPropertiesUpdated={handleHuntUpdated}
                currentHunt={currentHunt}
                matchmakingCompleteSignal={notificationSignal}
                {...props}
            />
        ) : null;
    }

    return (
        <BlockLoader<HuntWithProperties>
            onError={onError}
            isLoaded={!!currentHunt}
            loadFunction={loadHunt}
            onLoaded={setCurrentHunt}
        >
            <HuntSubscriptionHolder hunt={currentHunt as HuntWithProperties}>{getNavigator}</HuntSubscriptionHolder>
        </BlockLoader>
    );
}
