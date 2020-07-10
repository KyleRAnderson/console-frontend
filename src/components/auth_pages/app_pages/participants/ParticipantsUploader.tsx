import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { uploadParticipants } from '../../../../api/participantAPI';
import ErrorParticipant from '../../../../models/ErrorParticipant';
import Roster from '../../../../models/Roster';
import { createNotification } from '../../../../notification';
import ParticipantErrors from './ParticipantErrors';
import UploadForm from './UploadForm';

export type Props = {
    roster: Roster | string;
    onSuccess?: () => void;
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
        createNotification({ type: 'success', message: 'Participants Uploaded' });
        setShowModal(false);
        setErrorData(undefined);
        props.onSuccess?.();
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
            <Modal.Header closeButton>
                <Modal.Title>Upload Errors</Modal.Title>
            </Modal.Header>
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
            <UploadForm onUpload={uploadData} />
            {errorData && (
                <Button variant="warning" onClick={showErrors}>
                    Show Errors
                </Button>
            )}
            {modal}
        </>
    );
}
