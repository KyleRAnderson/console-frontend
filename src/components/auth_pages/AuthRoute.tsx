// Pages involved in authentication or that need authentication in order to be accessed.

import React, { useState, useEffect } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import * as AppPaths from '../../routes/AppPaths';
import { createNotification } from '../../notification';
import { isLoggedIn, setOnAuthFailure } from '../../auth';

function AuthRoute<T extends RouteProps>({ children, component, render, ...rest }: T): JSX.Element {
    const [authenticated, setAuthenticated] = useState(isLoggedIn());

    function onAuthFailure(): void {
        createNotification({ message: 'Session has Expired', type: 'warning' });
        setAuthenticated(isLoggedIn());
    }

    useEffect(() => {
        const authFailureSubscription = setOnAuthFailure(onAuthFailure);

        return function cleanup() {
            authFailureSubscription.detach();
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
                    return <Redirect to={{ pathname: AppPaths.LOGIN_PATH, state: { from: props.location } }} />;
                }
            }}
        />
    );
}

export default AuthRoute;
