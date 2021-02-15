import React from 'react';
import { render } from "react-dom";
import { Router, Route, Switch } from 'react-router'
import { createBrowserHistory } from "history";
import './App.scss';
import CheckoutNew from './App';

const history = createBrowserHistory();

render(
  <Router history={history}>
    <Switch>
      <Route path="/" exact component={CheckoutNew} />
    </Switch>
  </Router>,
  document.querySelector("#ahh")
);
