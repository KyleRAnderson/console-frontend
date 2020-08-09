import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { bulkCreateLicenses } from '../../../../api/licenseAPI';
import Hunt from '../../../../models/Hunt';
import { LicenseWithErrors } from '../../../../models/License';
import { toSentenceArray } from '../../../../models/ServerError';
import { createNotification } from '../../../../notification';

export type Props = {
    hunt?: string | Hunt;
    /** Function to be called when the licenses have been created. */
    onCreate?: () => void;
};

export default function LicenseBulkCreator({ hunt, onCreate }: Props): JSX.Element {
    const [creationErrors, setCreationErrors] = useState<LicenseWithErrors[] | undefined>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    function handleClick(): void {
        if (hunt) {
            setIsSubmitting(true);
            bulkCreateLicenses(hunt)
                .then(({ data: { failed } }) => {
                    createNotification({ type: 'success', message: '👍' });
                    failed.length > 0 && setCreationErrors(failed);
                    onCreate?.();
                    setIsSubmitting(false);
                })
                .catch(() => {
                    createNotification({ type: 'danger', message: 'Failed to add participants' });
                    setIsSubmitting(false);
                });
        }
    }

    return (
        <>
            <Button disabled={isSubmitting || !hunt} onClick={handleClick} variant="outline-success">
                Add All
            </Button>
            {
                <Modal show={!!creationErrors} onHide={() => setCreationErrors(undefined)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Participant Errors</Modal.Title>
                        There were some errors adding participants.
                    </Modal.Header>
                    <Modal.Body>
                        {creationErrors &&
                            creationErrors.map((licenseError) => {
                                return (
                                    <div key={licenseError.participant_id}>
                                        <h4>{licenseError.participant_id}</h4>
                                        <ul>
                                            {toSentenceArray(licenseError.errors).map((sentence, i) => {
                                                return <li key={i}>{sentence}</li>;
                                            })}
                                        </ul>
                                    </div>
                                );
                            })}
                    </Modal.Body>
                </Modal>
            }
        </>
    );
}
