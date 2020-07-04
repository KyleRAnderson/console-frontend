import React from 'react';
import { eliminateAll, eliminateHalf } from '../../../../api/licenseAPI';
import Hunt from '../../../../models/Hunt';
import NextRoundForm, { CloseMethod } from './NextRoundForm';
import { createRound } from '../../../../api/roundAPI';
import { createNotification } from '../../../../notification';
import { asServerError, formatForPrint } from '../../../../models/ServerError';

export type Props = {
    hunt: Hunt;
    onUpdated?: () => void;
};

/**
 * Component for advancing the hunt to the next round.
 */
export default function NextRound(props: Props): JSX.Element {
    function createNewRound(): void {
        createRound(props.hunt, {})
            .then(() => {
                createNotification({ type: 'success', message: 'Round created' });
                props.onUpdated?.();
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
    }

    function handleFormSubmit(roundResolution: CloseMethod): void {
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
        }
    }

    return <NextRoundForm onSubmit={handleFormSubmit} />;
}
