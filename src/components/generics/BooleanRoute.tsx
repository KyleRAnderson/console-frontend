import React from 'react';
import { Route, RouteProps } from 'react-router-dom';

type Props = {
    children: (show: boolean) => React.ReactNode;
    pathExtension: string;
} & Omit<RouteProps, 'path'>;

/**
 * A wrapper for the react Route component which
 */
export default function BooleanRoute({ children, pathExtension, ...routeProps }: Props): JSX.Element {
    const pathRegex = new RegExp(`\/${pathExtension.replace('/', '')}\/?$`);
    return (
        <Route {...routeProps} path={`*/(${pathExtension})?`}>
            {(props) => children(pathRegex.test(props.location.pathname))}
        </Route>
    );
}
