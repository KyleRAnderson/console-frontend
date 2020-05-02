import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from '../components/Home';
import UserList from '../components/user/Users';
import Register from '../components/Register';
import * as appPaths from './AppLocations';
import AuthPages from '../components/auth_pages/AuthPages';

export default () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={appPaths.root} component={Home} />
                <Route path={appPaths.usersRoot} component={UserList} />
                <Route path={appPaths.registerUrl} component={Register} />
                // The following are all for AuthPages. Couldn't find a better way of doing multiple like this.
                <Route exact path={appPaths.loginUrl} component={AuthPages} />
                <Route path={appPaths.app} component={AuthPages} />
            </Switch>
        </BrowserRouter>
    );
};
