import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from '../components/Home';
import UserList from '../components/user/Users';
import Register from '../components/Register';
import AppPaths from './AppLocations';
import AuthRoute from '../components/auth_pages/AuthRoute';
import Login from '../components/Login';
import AppPage from '../components/auth_pages/app_pages/AppPage';

export default () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={AppPaths.root} component={Home} />
                <Route path={AppPaths.usersRoot} component={UserList} />
                <Route path={AppPaths.registerUrl} component={Register} />
                // The following are all for AuthPages. Couldn't find a better way of doing multiple like this.
                <Route exact path={AppPaths.loginUrl} component={Login} />
                <AuthRoute path={AppPaths.app} component={AppPage} />
            </Switch>
        </BrowserRouter>
    );
};
