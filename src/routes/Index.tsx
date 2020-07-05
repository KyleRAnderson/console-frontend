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
import NotFound from './NotFound';
import UpdatePassword from '../components/user/UpdatePassword';

export default function Index(): JSX.Element {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={AppPaths.ROOT} component={Home} />
                <Route exact path={AppPaths.confirmationPath()} component={UserConfirmation} />
                <Route exact path={AppPaths.CONFIRMATION_BASE_PATH} component={ResendConfirmation} />
                <Route exact path={AppPaths.RESET_PASSWORD_BASE_PATH} component={SendResetPassword} />
                <Route exact path={AppPaths.resetPasswordPath()} component={ResetPassword} />
                <Route exact path={AppPaths.REGISTER_PATH} component={Register} />
                <Route exact path={AppPaths.LOGIN_PATH} component={Login} />
                <AuthRoute path={AppPaths.APP_ROOT} component={AppPage} />
                <AuthRoute path={AppPaths.UPDATE_PASSWORD_PATH} component={UpdatePassword} />
                <Route path="*" component={NotFound} />
            </Switch>
        </BrowserRouter>
    );
}
