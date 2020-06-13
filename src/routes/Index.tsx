import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from '../components/Home';
import Register from '../components/user/Register';
import * as AppPaths from './AppPaths';
import AuthRoute from '../components/auth_pages/AuthRoute';
import Login from '../components/user/Login';
import AppPage from '../components/auth_pages/app_pages/AppPage';
import UserConfirmation from '../components/user/UserConfirmation';
import ResendConfirmation from '../components/user/ResendConfirmation';
import ResetPassword from '../components/user/ResetPassword';
import SendResetPassword from '../components/user/SendResetPassword';

export default function Index(): JSX.Element {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={AppPaths.root} component={Home} />
                <Route exact path={AppPaths.confirmationPath()} component={UserConfirmation} />
                <Route exact path={AppPaths.confirmationBasePath} component={ResendConfirmation} />
                <Route exact path={AppPaths.resetPasswordBasePath} component={SendResetPassword} />
                <Route exact path={AppPaths.resetPasswordPath()} component={ResetPassword} />
                <Route path={AppPaths.registerUrl} component={Register} />
                <Route exact path={AppPaths.loginUrl} component={Login} />
                <AuthRoute path={AppPaths.app} component={AppPage} />
            </Switch>
        </BrowserRouter>
    );
}
