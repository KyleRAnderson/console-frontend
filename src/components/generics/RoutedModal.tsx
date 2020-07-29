import React from 'react';
import { Modal } from 'react-bootstrap';
import { ModalHeaderProps } from 'react-bootstrap/ModalHeader';
import BooleanRoute from './BooleanRoute';

export type Props = {
    /** Options to be provided to the modal itself. */
    modalOptions?: Omit<React.ComponentProps<typeof Modal>, 'show'>;
    /** Options to be provided to the generated Modal.Header */
    headerOptions?: ModalHeaderProps;
    /** The element to display in the modal's title. */
    modalTitle?: React.ReactNode;
    /** The element to display in the modal's footer. */
    modalFooter?: React.ReactNode;
    /** The path extension (last word in the URL) for which this should be rendered */
    route: string;
    /** The modal's content element. */
    content: React.ReactNode;
};

export default function RoutedModal({
    headerOptions,
    modalTitle,
    modalFooter,
    content,
    route,
    modalOptions: modalProps,
}: Props): JSX.Element {
    const modalHeader = modalTitle && (
        <Modal.Header {...headerOptions}>
            <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
    );

    if (!content) {
        return <></>;
    }
    return (
        <BooleanRoute path={route}>
            {(show) => {
                return (
                    <Modal {...modalProps} show={show}>
                        {modalHeader}
                        <Modal.Body>{content}</Modal.Body>
                        {modalFooter}
                    </Modal>
                );
            }}
        </BooleanRoute>
    );
}
