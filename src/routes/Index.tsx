import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Landing from "../components/Landing";

export default (
  <Router>
    <Switch>
      <Route path="/" exact component={Landing} />
    </Switch>
  </Router>
);