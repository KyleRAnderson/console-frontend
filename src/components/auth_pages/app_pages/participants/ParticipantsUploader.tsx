import React, { useState } from 'react';
import UploadForm from './UploadForm';
import Roster from '../../../../models/Roster';
import { uploadParticipants } from '../../../../api/participantAPI';
import { createNotification } from '../../../../notification';
import { AxiosError } from 'axios';
import ParticipantErrors from './ParticipantErrors';
import ErrorParticipant from '../../../../models/ErrorParticipant';
import { Modal, Button, Col } from 'react-bootstrap';

export type Props = {
    roster: Roster | string;
};

export default function ParticipantsUploader(props: Props): JSX.Element {
    const [errorData, setErrorData] = useState<ErrorParticipant[]>();
    const [showModal, setShowModal] = useState<boolean>(false);

    function hideErrors(): void {
        setShowModal(false);
    }

    function showErrors(): void {
        setShowModal(true);
    }

    function handleSuccess(): void {
        createNotification({ type: 'success', message: 'Participants Uploading...' });
        setShowModal(false);
        setErrorData(undefined);
    }

    function handleError(error: unknown): void {
        function isErrorFormat(error: unknown): boolean {
            return (
                Array.isArray(error) &&
                error.every((obj) => {
                    return (
                        ['first', 'last', 'extras', 'errors'].every((key) => key in obj) &&
                        typeof obj.errors == 'object' &&
                        Object.values(obj.errors).every((value) => Array.isArray(value))
                    );
                })
            );
        }

        function asErrorFormat(error: unknown): ErrorParticipant[] | undefined {
            return isErrorFormat(error) ? (error as ErrorParticipant[]) : undefined;
        }

        if (error) {
            const casted: AxiosError = error as AxiosError;
            const data = asErrorFormat(casted.response?.data);
            if (data) {
                setErrorData(data);
                showErrors();
            } else if (typeof casted.response?.data === 'string') {
                createNotification({ type: 'danger', message: casted.response.data });
            }
        }
    }

    function uploadData(formData: FormData): void {
        uploadParticipants(props.roster, formData).then(handleSuccess).catch(handleError);
    }

    const modal: React.ReactNode = errorData && (
        <Modal size="lg" show={showModal} onHide={hideErrors}>
            <Modal.Header closeButton>Upload Errors</Modal.Header>
            <Modal.Body>
                <ParticipantErrors errors={errorData} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={hideErrors}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return (
        <>
            <Col lg="4" md="6">
                <UploadForm onUpload={uploadData} />
            </Col>
            {errorData && (
                <Col lg="4" md="6">
                    <Button variant="warning" onClick={showErrors}>
                        Show Errors
                    </Button>
                </Col>
            )}
            {modal}
        </>
    );
}
