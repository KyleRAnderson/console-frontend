import React, { useState } from 'react';
import { createLicense } from '../../../../api/licenseAPI';
import Participant, { ParticipantBase } from '../../../../models/Participant';
import { asServerError, formatForPrint } from '../../../../models/ServerError';
import { createNotification } from '../../../../notification';
import getId from '../../../../util/identifiableHelper';
import { ParticipantsProps } from './ParticipantsTable';

type SingleColumn<T extends ParticipantBase> = Exclude<ParticipantsProps<T>['extraColumns'], undefined>[number];

export type Props<T extends ParticipantBase> = {
    children: (extraColumn: SingleColumn<T> | undefined) => React.ReactNode;
    hunt: Parameters<typeof createLicense>[0] | undefined;
    /** Function to be called when a participant is added to a hunt. */
    onAdded?: () => void;
};

export default function ParticipantAdder<T extends Participant>({ children, hunt, onAdded }: Props<T>): JSX.Element {
    const [isSubmittingMap, setIsSubmittingMap] = useState<{ [key: string]: boolean }>({});
    function addParticipant(participant: string | T): void {
        function removeFromSubmittingMap(key: string) {
            const { [key]: _value, ...others } = isSubmittingMap;
            setIsSubmittingMap(others);
        }

        if (hunt) {
            const participantId = getId(participant);
            // Extra check, the button disable still lets stuff through.
            if (isSubmittingMap[participantId]) {
                return;
            }
            setIsSubmittingMap({ ...isSubmittingMap, [participantId]: true });
            createLicense(hunt, { participant_id: participantId })
                .then(() => {
                    onAdded?.();
                    removeFromSubmittingMap(participantId);
                })
                .catch((error) => {
                    let title: string | undefined;
                    let message = 'Failed to add Participant';
                    const errorCasted = asServerError(error);
                    if (errorCasted) {
                        title = message;
                        message = formatForPrint(errorCasted.detail);
                    }
                    createNotification({ type: 'danger', message: message, title: title });
                    removeFromSubmittingMap(participantId);
                });
        }
    }

    function buttonForParticipant(participant: T): React.ReactNode {
        return (
            <td key={participant.id}>
                <button
                    disabled={isSubmittingMap[participant.id]}
                    className="btn-default btn"
                    onClick={() => addParticipant(participant)}
                >
                    <svg
                        width="1em"
                        height="1em"
                        viewBox="0 0 16 16"
                        className="bi bi-plus-square"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"
                        />
                        <path
                            fillRule="evenodd"
                            d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"
                        />
                        <path
                            fillRule="evenodd"
                            d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                        />
                    </svg>
                </button>
            </td>
        );
    }

    const adderColumn: SingleColumn<T> | undefined = hunt ? ['Add to Hunt', buttonForParticipant] : undefined;

    return <>{children(adderColumn)}</>;
}
