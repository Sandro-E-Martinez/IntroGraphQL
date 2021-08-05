import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client'
import client from './apollo';
import CssBaseline from '@material-ui/core/CssBaseline';

import App from './App';

ReactDOM.render(
  <React.StrictMode>
      <CssBaseline />
        <App />
  </React.StrictMode>,
  document.getElementById('root')
);