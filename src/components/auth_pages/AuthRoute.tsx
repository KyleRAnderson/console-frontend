// Pages involved in authentication or that need authentication in order to be accessed.

import React, { useState, useEffect } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import AppPaths from '../../routes/AppPaths';
import Auth from '../../auth';
import Notifications from '../../notification';

export class AuthRoute extends Route {}

function authRoute<T extends RouteProps>({ children, component, render, ...rest }: T): JSX.Element {
    const [authenticated, setAuthenticated] = useState(Auth.isLoggedIn());

    const onAuthFailure: Auth.AuthFailureSubscriber = () => {
        setAuthenticated(Auth.isLoggedIn());
        Notifications.createNotification({ message: 'Session has Expired', type: 'warning' });
    };

    useEffect(() => {
        Auth.onAuthFailure(onAuthFailure);

        return function cleanup() {
            Auth.removeAuthFailureSubscription(onAuthFailure);
        };
    }, []);

    return (
        <Route
            {...rest}
            render={(props) => {
                if (authenticated) {
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
