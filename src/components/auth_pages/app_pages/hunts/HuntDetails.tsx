import React, { useEffect, useRef, useState } from 'react';
import { HuntWithProperties } from '../../../../models/Hunt';
import HuntNavigator from './HuntNavigator';
import NewMatchSubscription from './NewMatchSubscription';
import { createNotification } from '../../../../notification';

export type Props = {
    hunt: HuntWithProperties;
    /** Function to call in order to update the hunt. */
    updateHunt: (hunt: HuntWithProperties) => void;
    /** Function to call when the hunt needs to be reloaded. */
    reloadHunt: () => void;
};

export default function HuntDetails({ hunt, updateHunt, reloadHunt }: Props): JSX.Element {
    const subscriptionHolder = useRef<NewMatchSubscription>();
    /** True if there are new matches in the hunt to load, false otherwise. */
    const [areNewMatches, setAreNewMatches] = useState<boolean>(false);

    useEffect(() => {
        subscriptionHolder.current = new NewMatchSubscription(hunt, () => {
            createNotification({ type: 'success', message: 'New Matches Loaded!' });
            setAreNewMatches(true);
        });

        return () => {
            subscriptionHolder.current?.cleanup();
        };
    }, []);
    useEffect(() => {
        hunt.current_round_number === 0 && reloadHunt();
    }, [areNewMatches]);

    function handleHuntUpdated(newHuntProperties?: Partial<HuntWithProperties>): void {
        if (newHuntProperties) {
            updateHunt({ ...hunt, ...newHuntProperties });
        }
    }

    return (
        <HuntNavigator
            onHuntPropertiesUpdated={handleHuntUpdated}
            currentHunt={hunt}
            setNewMatches={setAreNewMatches}
            newMatches={areNewMatches}
        />
    );
}
