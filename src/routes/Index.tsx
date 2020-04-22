import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../components/Home';
import UserList from '../components/user/Users';
import UserShow from '../components/user/UserShow';
import * as appPaths from './AppLocations';

export default (
  <Router>
    <Switch>
      <Route path={appPaths.root} exact component={Home} />
      <Route path={appPaths.usersRoot} exact component={UserList} />
      <Route path={appPaths.usersRoot + '/:id'} exact component={UserShow} />
    </Switch>
  </Router>
);