import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Header } from "./Header";
import Todo from './pages/Todo';

export default function Routes() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/todos" component={Todo} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};