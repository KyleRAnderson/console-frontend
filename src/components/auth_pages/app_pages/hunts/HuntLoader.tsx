import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getHunt } from '../../../../api/huntAPI';
import { HuntWithProperties } from '../../../../models/Hunt';
import { createNotification } from '../../../../notification';
import * as AppPaths from '../../../../routes/AppPaths';
import LoadUntilReady from '../../../generics/LoadUntilReady';
import HuntDetails from './HuntDetails';

export type Props = {
    hunt?: HuntWithProperties;
};

export default function HuntLoader({ hunt, ...routeProps }: Props): JSX.Element {
    const [loadedHunt, setLoadedHunt] = useState<HuntWithProperties>();
    const previousHuntId = useRef<string | undefined>();
    const history = useHistory();
    const { [AppPaths.HUNT_ID_PARAM]: huntId } = useParams();

    function onError(): void {
        createNotification({ message: 'Failed to load hunt data.', type: 'danger' });
        history.goBack();
    }

    function loadHunt(): void {
        getHunt(huntId)
            .then(({ data: hunt }) => {
                setLoadedHunt(hunt);
            })
            .catch(onError);
    }

    useEffect(() => {
        const newHuntId = huntId;
        if (newHuntId !== previousHuntId.current && (previousHuntId.current !== undefined || !hunt)) {
            loadHunt();
        } else {
            setLoadedHunt(hunt);
        }
    }, [hunt, huntId]);

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
