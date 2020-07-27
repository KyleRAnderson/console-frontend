import React, { useEffect, useRef, useState } from 'react';
import { asInstantPrintUpdate } from '../../../../api/huntAPI';
import { HuntWithProperties } from '../../../../models/Hunt';
import { createNotification } from '../../../../notification';
import HuntNavigator from './HuntNavigator';
import NewMatchSubscription from './NewMatchSubscription';

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
        subscriptionHolder.current = new NewMatchSubscription(hunt, (obj) => {
            const objAsInstantPrintUpdate = asInstantPrintUpdate(obj);
            if (!objAsInstantPrintUpdate) {
                createNotification({ type: 'success', message: 'New Matches Loaded!' });
                setAreNewMatches(true);
            } else {
                if (objAsInstantPrintUpdate.success) {
                    const url = objAsInstantPrintUpdate.output_url;
                    let message: string | React.ReactNode = 'Instant Print Completed!';
                    let title: string | undefined;

                    if (url) {
                        title = message as string;
                        message = (
                            <a href={url} target="_blank" rel="noreferrer">
                                View Output
                            </a>
                        );
                    }
                    createNotification({
                        type: 'success',
                        title: title,
                        message: message,
                        dismiss: undefined,
                    });
                    reloadHunt();
                } else {
                    createNotification({ type: 'danger', message: 'Execution of Instant Print Failed!' });
                }
            }
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
