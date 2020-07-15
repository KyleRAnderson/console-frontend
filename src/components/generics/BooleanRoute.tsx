import React from 'react';
import { Route, RouteProps } from 'react-router-dom';

type Props = {
    children: (show: boolean) => React.ReactNode;
    /** The end of the path to match. */
    pathExtension: string;
} & Omit<RouteProps, 'path'>;

/**
 * A wrapper for the react Route component which always renders its children but supplies them with a boolean
 * value for whether or not the full path matches.
 */
export default function BooleanRoute({ children, pathExtension, ...routeProps }: Props): JSX.Element {
    const pathRegex = new RegExp(`\/${pathExtension.replace(/(^\/|\/$)/g, '')}\/?$`);
    return (
        <Route {...routeProps} path={`*/(${pathExtension})?`}>
            {(props) => children(pathRegex.test(props.location.pathname))}
        </Route>
    );
}
