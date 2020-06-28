import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ContextWrapper from './ContextWrapper';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from "./react-auth0-spa";
import config from "./auth_config.json";
import history from "./utils/history";
import * as serviceWorker from './serviceWorker';
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'


ReactDOM.render(
  <DndProvider backend={Backend}>
    <ContextWrapper />
  </DndProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();