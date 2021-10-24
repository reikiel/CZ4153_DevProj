import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IsLoggedIn, HasSpecialAccess } from "./AuthenticationService";

import { default as AccountStore } from "../stores/AccountStore";
import { IDEAS_ROUTE, LOGIN_ROUTE } from "../constants/RouteConstants";

/**
 * Sets an authenticated route.
 * Redirects user to the root page if user is not logged in.
 * Redirects user to base landing page for logged in users if
 * user does not have sufficient permissions to view the resource
 */
export default function AuthenticatedRoute({ path, children }) {
  const accountStore = AccountStore.useStore();

  const isLoggedIn = IsLoggedIn(accountStore);
  const hasAccess = HasSpecialAccess(accountStore, path);

  if (!isLoggedIn) {
    return (<Redirect to={LOGIN_ROUTE} />);
  }

  return (
    <Route path={path}>
      {hasAccess ? children : <Redirect to={IDEAS_ROUTE} />}
    </Route>
  );
}
