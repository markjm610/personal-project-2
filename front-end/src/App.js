import React from 'react';
import { useAuth0 } from "./react-auth0-spa";
import { Router, Route, Switch } from "react-router-dom";
import Profile from "./Profile";
import history from "./utils/history";
import PrivateRoute from "./PrivateRoute";
import MainPage from './MainPage';
import LandingPage from './LandingPage'


function App() {


  const { loading } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={LandingPage} />
        <PrivateRoute path="/main" component={MainPage} />
        {/* <Route path="/profile" component={Profile} /> */}
        <PrivateRoute path="/profile" component={Profile} />
      </Switch>
    </Router>
  );
}

export default App;