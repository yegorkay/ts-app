import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'react-table/react-table.css';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { getParams } from './utils';

const RouterConfig = () => (
  <Router>
    <Route
      path="/"
      render={({ location, history }) => {
        const { query } = getParams(location);
        return <App query={query} history={history} />;
      }}
    />
  </Router>
);

ReactDOM.render(<RouterConfig />, document.getElementById('root'));
registerServiceWorker();
