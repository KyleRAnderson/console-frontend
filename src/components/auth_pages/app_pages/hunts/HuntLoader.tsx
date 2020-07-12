import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getHunt } from '../../../../api/huntAPI';
import { HuntWithProperties } from '../../../../models/Hunt';
import { createNotification } from '../../../../notification';
import * as AppPaths from '../../../../routes/AppPaths';
import LoadUntilReady from '../../../generics/LoadUntilReady';
import HuntDetails from './HuntDetails';

export type Props = RouteComponentProps<{ [AppPaths.HUNT_ID_PARAM]: string }> & {
    hunt?: HuntWithProperties;
};

export default function HuntLoader({ hunt, ...routeProps }: Props): JSX.Element {
    const [loadedHunt, setLoadedHunt] = useState<HuntWithProperties>();
    const previousHuntId = useRef<string | undefined>();

    function onError(): void {
        createNotification({ message: 'Failed to load hunt data.', type: 'danger' });
        routeProps.history.goBack();
    }

    function loadHunt(): void {
        getHunt(routeProps.match.params[AppPaths.HUNT_ID_PARAM])
            .then((hunt) => {
                setLoadedHunt(hunt);
            })
            .catch(onError);
    }

    useEffect(() => {
        const newHuntId = routeProps.match.params[AppPaths.HUNT_ID_PARAM];
        if (newHuntId !== previousHuntId.current && (previousHuntId.current !== undefined || !hunt)) {
            loadHunt();
        } else {
            setLoadedHunt(hunt);
        }
    }, [hunt, routeProps.match.params[AppPaths.HUNT_ID_PARAM]]);

    return (
        <LoadUntilReady isLoaded={!!loadedHunt}>
            <HuntDetails
                {...routeProps}
                reloadHunt={loadHunt}
                updateHunt={setLoadedHunt}
                hunt={loadedHunt as HuntWithProperties}
            />
        </LoadUntilReady>
    );
}
