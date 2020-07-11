import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import Hunt from '../../../../models/Hunt';
import AddLicenses from './AddLicenses';

export type Props = {
    hunt: Hunt;
    /** Function to call when the modal needs to close/hide. */
    onHide: () => void;
};

/**
 * Component for creating licenses for participants in a given hunt.
 */
export default function AddLicensesModal(props: Props): JSX.Element {
    function submitRequest(): void {
        props.onHide();
        // TODO implement.
    }

    return (
        <Modal show>
            <Modal.Header>
                <Modal.Title>Add Participants</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AddLicenses hunt={props.hunt} />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={submitRequest} />
            </Modal.Footer>
        </Modal>
    );
}
