// Pages involved in authentication or that need authentication in order to be accessed.

import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import AppPaths from '../../routes/AppLocations';
import Auth from '../../auth';

export class AuthRoute extends Route {}

function authRoute<T extends RouteProps>({ children, component, render, ...rest }: T): JSX.Element {
    return (
        <Route
            {...rest}
            render={(props) => {
                if (Auth.isLoggedIn()) {
                    // This is the same priority given to the regular route component.
                    if (children) {
                        return children;
                    } else if (component) {
                        return React.createElement(component, props);
                    } else if (render) {
                        return render(props);
                    } else {
                        return null;
                    }
                } else {
                    return <Redirect to={{ pathname: AppPaths.loginUrl, state: { from: props.location } }} />;
                }
            }}
        />
    );
}

export default authRoute;
