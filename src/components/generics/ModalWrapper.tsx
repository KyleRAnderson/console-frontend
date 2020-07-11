import React from 'react';
import { Modal, ModalProps } from 'react-bootstrap';

export type Props = ModalProps & {
    modalTitle?: React.ReactNode;
    node: React.ReactNode;
};

/**
 * Component to facilitate wrapping other components in a modal.
 */
export default function ModalWrapper({ modalTitle, node, ...modalProps }: Props): JSX.Element {
    return (
        <Modal size="lg" {...modalProps}>
            {modalTitle && (
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
            )}
            <Modal.Body>{node}</Modal.Body>
        </Modal>
    );
}

/**
 * Creates a render prop wrapper for the given modal props.
 * @param modalProps The modal props to be passed to the ModalWrapper component.
 */
export function renderPropWrap(modalProps: Props): (show: boolean) => React.ReactNode {
    // eslint-disable-next-line react/display-name
    return (show) => {
        return <ModalWrapper {...modalProps} show={show} />;
    };
}
