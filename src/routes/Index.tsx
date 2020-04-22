import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../components/Home';
import UserList from '../components/user/Users';
import * as appPaths from './AppLocations';

export default (
    <Router>
        <Switch>
            <Route path={appPaths.root} exact component={Home} />
            <Route path={appPaths.usersRoot} exact component={UserList} />
        </Switch>
    </Router>
);
