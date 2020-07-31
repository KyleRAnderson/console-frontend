import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { deleteLicense } from '../../../../api/licenseAPI';
import License from '../../../../models/License';
import { createNotification } from '../../../../notification';
import getId from '../../../../util/identifiableHelper';

export type Props = {
    /** The license to be deleted, if requested. */
    license: Pick<License, 'id'> | string;
    /** Function to be called when a license is successfully deleted. */
    onDelete?: (deletedLicense: string) => void;
};

/**
 * Component for creating a button to delete licenses from a hunt (or to the user, remove a participant from a hunt).
 */
export default function DeleteButton({ license, onDelete }: Props): JSX.Element {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

    function handleDelete(): void {
        if (isSubmitting) return;

        setIsSubmitting(true);
        deleteLicense(license)
            // Important to handle all state updates before calling onDelete, else we get unmounted and then try to change state.
            .finally(() => {
                setIsSubmitting(false);
            })
            .then(() => {
                setShowConfirmation(false);
                createNotification({ type: 'success', message: 'License deleted' });
                onDelete?.(getId(license));
            })
            .catch(() => {
                createNotification({ type: 'danger', message: 'Failed to delete license' });
            });
    }

    function handleHideModal(): void {
        // Don't dismiss modal until done submission.
        if (isSubmitting) return;
        setShowConfirmation(false);
    }

    return (
        <>
            <Modal show={showConfirmation} onHide={handleHideModal}>
                <Modal.Header>
                    <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Removing a participant from a hunt will delete all associated records for that participant in this
                    hunt.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" disabled={isSubmitting} onClick={handleHideModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" disabled={isSubmitting} onClick={handleDelete}>
                        Remove
                    </Button>
                </Modal.Footer>
            </Modal>
            <Button disabled={isSubmitting} variant="danger" onClick={() => setShowConfirmation(true)}>
                Remove
            </Button>
        </>
    );
}
