import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from '../components/Home';
import UserList from '../components/user/Users';
import Register from '../components/Register';
import AppPaths from './AppPaths';
import AuthRoute from '../components/auth_pages/AuthRoute';
import Login from '../components/Login';
import AppPage from '../components/auth_pages/app_pages/AppPage';
import UserConfirmation from '../components/user/UserConfirmation';

export default () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={AppPaths.root} component={Home} />
                <Route path={AppPaths.usersRoot} component={UserList} />
                <Route path={AppPaths.confirmationPath()} component={UserConfirmation} />
                <Route path={AppPaths.registerUrl} component={Register} />
                <Route exact path={AppPaths.loginUrl} component={Login} />
                <AuthRoute path={AppPaths.app} component={AppPage} />
            </Switch>
        </BrowserRouter>
    );
};
