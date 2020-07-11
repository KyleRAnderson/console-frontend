import React from 'react';
import BooleanRoute from './BooleanRoute';

export type Props = {
    routeMap: {
        /** Either a function which takes a boolean to show and hide the modal, and renders the modal,
         * or nothing to do nothing on click. */
        modal?: ((show: boolean) => React.ReactNode) | null;
        route?: string;
    }[];
    onHide: () => void;
};

export default function RoutedModals(props: Props): JSX.Element {
    function routedModalFor(
        pathExtension: string,
        modal: Props['routeMap'][number]['modal'],
        index: number,
    ): React.ReactNode {
        return (
            modal && (
                <BooleanRoute key={index} pathExtension={pathExtension}>
                    {modal}
                </BooleanRoute>
            )
        );
    }

    const routes = props.routeMap.map(({ route, modal }, i) => {
        return route && routedModalFor(route, modal, i);
    });

    return <>{routes}</>;
}
