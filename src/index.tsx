import React from 'react';
import { render } from "react-dom";
import { Router, Route, Switch } from 'react-router'
import { createBrowserHistory } from "history";
import './App.css';
import CheckoutNew from './App';

import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";

const history = createBrowserHistory();

// Config object to be passed to Msal on creation
const msalConfig = {
  auth: {
      clientId: "e0f78ca4-180a-4a75-9e20-cee064e9dd3a",
      authority: "https://delightrewards.b2clogin.com/delightrewards.onmicrosoft.com/b2c_1_signupsignupstartupbrodown",
      knownAuthorities: ["delightrewards.b2clogin.com"],
      redirectUri: "http://localhost:3000",
      postLogoutRedirectUri: "http://localhost:3000"
  }
};

const pca = new PublicClientApplication(msalConfig);

const acquireAccessToken = async (msalInstance=pca) => {
  const activeAccount = msalInstance.getActiveAccount(); // This will only return a non-null value if you have logic somewhere else that calls the setActiveAccount API
  const accounts = msalInstance.getAllAccounts();

  if (!activeAccount && accounts.length === 0) {
      /*
      * User is not signed in. Throw error or wait for user to login.
      * Do not attempt to log a user in outside of the context of MsalProvider
      */   
  }
  const request = {
      scopes: ["delight_default_access"],
      account: activeAccount || accounts[0]
  };

  const authResult = await msalInstance.acquireTokenSilent(request);

  return authResult.accessToken
};

render(
  <MsalProvider instance={pca}>
    <Router history={history}>
      <Switch>
        {/* @ts-ignore */}
        <Route path="/" exact render={ () => {return (<CheckoutNew getToken={acquireAccessToken}  />);}} />
      </Switch>
    </Router>
  </MsalProvider>,
  document.querySelector("#ahh")
);


