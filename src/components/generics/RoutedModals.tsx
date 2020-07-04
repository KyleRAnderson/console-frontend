import React from 'react';
import { Switch } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import BooleanRoute from './BooleanRoute';

export type Props = {
    routeMap: {
        /** The element to display in the modal's title. */
        modalTitle?: React.ReactNode;
        /** The element to display in the modal's footer. */
        modalFooter?: React.ReactNode;
        /** The route for which this modal should be rendered. */
        route?: string;
        /** The modal's content element. */
        elementInModal: React.ReactNode;
    }[];
    onHide: () => void;
};

export default function RoutedModals(props: Props): JSX.Element {
    function routedModalFor(
        pathExtension: string,
        node: React.ReactNode,
        index: number,
        modalTitle?: React.ReactNode,
        modalFooter?: React.ReactNode,
    ): React.ReactNode {
        return (
            <BooleanRoute key={index} pathExtension={pathExtension}>
                {(show) => {
                    return (
                        <Modal size="lg" show={show} onHide={props.onHide}>
                            {modalTitle && (
                                <Modal.Header closeButton>
                                    <Modal.Title>{modalTitle}</Modal.Title>
                                </Modal.Header>
                            )}
                            <Modal.Body>{node}</Modal.Body>
                            {modalFooter && <Modal.Footer>{modalFooter}</Modal.Footer>}
                        </Modal>
                    );
                }}
            </BooleanRoute>
        );
    }

    return (
        <Switch>
            {props.routeMap.map(({ route, elementInModal, modalTitle: modalHeader, modalFooter }, i) => {
                return route && routedModalFor(route, elementInModal, i, modalHeader, modalFooter);
            })}
        </Switch>
    );
}
