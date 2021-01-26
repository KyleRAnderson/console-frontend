import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { ModalHeaderProps } from 'react-bootstrap/ModalHeader';
import { Route } from 'react-router-dom';

export type Props = {
    /** Options to be provided to the modal itself. */
    modalOptions?: Omit<React.ComponentProps<typeof Modal>, 'show' | 'onHide' | 'onExited'>;
    /** Options to be provided to the generated Modal.Header */
    headerOptions?: Omit<ModalHeaderProps, 'ref'>;
    /** The element to display in the modal's title. */
    modalTitle?: React.ReactNode;
    /** The element to display in the modal's footer. */
    modalFooter?: React.ReactNode;
    /** The path extension (last word in the URL) for which this should be rendered */
    route: string;
    /** The modal's content element. */
    content: React.ReactNode;
    /** Function to call when this modal has closed. Route is the same value as the passed in route prop.*/
    onHide?: (route: string) => void;
};

/**
 * @param param0 The modal child of this componenet. Should accept a show prop.
 */
function ModalHolder({
    children,
}: {
    children: (show: boolean, setShow: (show: boolean) => void) => React.ReactNode;
}): JSX.Element {
    const [show, setShow] = useState<boolean>(true);

    // Show modal on mount, since this means that the route matched.
    useEffect(() => {
        setShow(true);
    }, []);

    return <>{children(show, setShow)}</>;
}

export default function RoutedModal({
    headerOptions,
    modalTitle,
    modalFooter,
    content,
    route,
    modalOptions: modalProps,
    onHide,
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
        <Route
            exact
            path={route}
            render={() => {
                return (
                    <ModalHolder>
                        {(show, setShow) => {
                            return (
                                <Modal
                                    {...modalProps}
                                    show={show}
                                    onHide={() => setShow(false)}
                                    onExited={() => onHide?.(route)}
                                >
                                    {modalHeader}
                                    <Modal.Body>{content}</Modal.Body>
                                    {modalFooter}
                                </Modal>
                            );
                        }}
                    </ModalHolder>
                );
            }}
        />
    );
}
