import React from 'react';
import { useAuth0 } from "./react-auth0-spa";
import { Router, Route, Switch } from "react-router-dom";
import Profile from "./Profile";
import history from "./utils/history";
import PrivateRoute from "./PrivateRoute";
import MainPage from './MainPage';
import LandingPage from './LandingPage'
import { Auth0Provider } from "./react-auth0-spa";
import config from "./auth_config.json";
import * as serviceWorker from './serviceWorker';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';


const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};


function App() {


  return (
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <Router history={history}>
          <Switch>
            <Route path="/" exact component={LandingPage} />
            <PrivateRoute path="/main" component={MainPage} />
            <PrivateRoute path="/profile" component={Profile} />
          </Switch>
        </Router>
      </MuiPickersUtilsProvider>
    </Auth0Provider>

  );
}

export default App;