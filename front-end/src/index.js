import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ContextWrapper from './ContextWrapper';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <ContextWrapper />
  </BrowserRouter>,
  document.getElementById('root')
);