import React from 'react';
import PlanNav from './PlanNav';
import LineChart from './LineChart'
import TopBar from './TopBar'
import { useAuth0 } from "./react-auth0-spa";
import { Router, Route, Switch } from "react-router-dom";
import Profile from "./Profile";
import history from "./utils/history";
import PrivateRoute from "./PrivateRoute";


function App() {


  const { loading } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <Router history={history}>
      <TopBar />
      <PlanNav />
      <LineChart />
      <Switch>
        <Route path="/" exact />
        {/* <Route path="/profile" component={Profile} /> */}
        <PrivateRoute path="/profile" component={Profile} />
      </Switch>
    </Router>
  );
}

export default App;