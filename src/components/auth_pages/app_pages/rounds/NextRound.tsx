import React, { useState } from 'react';
import { eliminateAll, eliminateHalf } from '../../../../api/licenseAPI';
import { createRound } from '../../../../api/roundAPI';
import Hunt from '../../../../models/Hunt';
import { asServerError, formatForPrint } from '../../../../models/ServerError';
import { createNotification } from '../../../../notification';
import NextRoundForm, { CloseMethod } from './NextRoundForm';

export type Props = {
    hunt: Hunt;
    /** Function to call when a match is created.
     * @param newRoundNumber The new properties updated on the hunt object.
     */
    onUpdated?: (updatedHuntProperties: Partial<Hunt>) => void;
};

/**
 * Component for advancing the hunt to the next round.
 */
export default function NextRound(props: Props): JSX.Element {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    function createNewRound(): void {
        createRound(props.hunt, {})
            .finally(() => setIsSubmitting(false))
            .then(({ data: { number } }) => {
                createNotification({ type: 'success', message: 'Round created' });
                props.onUpdated?.({ current_round_number: number });
            })
            .catch((error) => {
                const errorCasted = asServerError(error);
                let message = 'Failed to advance round';
                let title: string | undefined;
                if (errorCasted) {
                    title = message;
                    message = formatForPrint(errorCasted.detail);
                }
                createNotification({ title: title, message: message, type: 'danger' });
            });
    }

    function genericFailure(): void {
        createNotification({ message: 'Failed to eliminate', type: 'danger' });
        setIsSubmitting(false);
    }

    function handleFormSubmit(roundResolution: CloseMethod): void {
        setIsSubmitting(true);
        switch (roundResolution) {
            case CloseMethod.CoinToss:
                eliminateHalf(props.hunt).then(createNewRound).catch(genericFailure);
                break;
            case CloseMethod.EliminateAll:
                eliminateAll(props.hunt).then(createNewRound).catch(genericFailure);
                break;
            case CloseMethod.EliminateNone:
                createNewRound();
                break;
            default:
                setIsSubmitting(false);
                break;
        }
    }

    return <NextRoundForm disabled={isSubmitting} onSubmit={handleFormSubmit} />;
}
