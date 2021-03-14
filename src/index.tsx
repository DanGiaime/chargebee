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

render(
  <MsalProvider instance={pca}>
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={CheckoutNew} />
      </Switch>
    </Router>
  </MsalProvider>,
  document.querySelector("#ahh")
);


