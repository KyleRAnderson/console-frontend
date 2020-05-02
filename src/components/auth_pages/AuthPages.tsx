// Pages involved in authentication or that need authentication in order to be accessed.

import React from 'react';
import Auth from '../../auth';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { loginUrl } from '../../routes/AppLocations';
import Login from '../Login';
import AppPage from './app_pages/AppPages';

export interface AuthProps {
    auth: Auth;
}

const emailKey: string = 'email';
const tokenKey: string = 'token';
const idKey: string = 'id';

interface State extends AuthProps {} // Just for a nicer name.

class AuthPages extends React.Component<any, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            auth: {
                email: '',
                auth_token: '',
                user_id: '',
            },
        };
    }

    componentDidMount() {
        // Restore the state from local storage
        const localStorageState: State = {
            auth: {
                email: localStorage.getItem(emailKey) || '',
                user_id: localStorage.getItem(idKey) || '',
                auth_token: localStorage.getItem(tokenKey) || '',
            },
        };
        this.setState(localStorageState);
    }

    render(): JSX.Element {
        const appPage: JSX.Element = <AppPage auth={this.state.auth} />;
        return (
            <BrowserRouter>
                <Switch>
                    <Route
                        exact
                        path={loginUrl}
                        render={() => <Login onTokenReceived={(email, token, id) => this.onLogin(email, token, id)} />}
                    />
                    <Route path="/" render={() => (this.state.auth.auth_token.length > 0 ? appPage : null)} />
                </Switch>
            </BrowserRouter>
        );
    }

    onLogin(email: string, token: string, id: string): void {
        let stateCopy: State = { ...this.state };
        stateCopy.auth.email = email;
        stateCopy.auth.auth_token = token;
        stateCopy.auth.user_id = id;
        this.setState(stateCopy, () => this.saveState());
    }

    saveState() {
        localStorage.setItem(emailKey, this.state.auth.email);
        localStorage.setItem(tokenKey, this.state.auth.auth_token);
        localStorage.setItem(idKey, this.state.auth.user_id);
    }
}

export default AuthPages;
