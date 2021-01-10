// Pages involved in authentication or that need authentication in order to be accessed.

import { useEffect, useState } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { isLoggedIn, setOnAuthFailure } from "../../auth";
import { createNotification } from "../../notification";
import * as AppPaths from "../../routes/AppPaths";

function AuthRoute<T extends RouteProps>(props: T): JSX.Element {
  const [authenticated, setAuthenticated] = useState(isLoggedIn());

  function onAuthFailure(): void {
    createNotification({ message: "Session has Expired", type: "warning" });
    setAuthenticated(isLoggedIn());
  }

  useEffect(() => {
    const authFailureSubscription = setOnAuthFailure(onAuthFailure);

    return function cleanup() {
      authFailureSubscription.detach();
    };
  }, []);

  if (authenticated) {
    return <Route {...props} />;
  } else {
    return (
      <Redirect
        to={{ pathname: AppPaths.LOGIN_PATH, state: { from: props.location } }}
      />
    );
  }
}

export default AuthRoute;
