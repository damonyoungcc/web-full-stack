import React, { Fragment } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import Home from './home';
import Sign from './sign';
import Manage from './manage';
import PrivateRoute from './components/PrivateRoute';
class App extends React.Component {
  render() {
    return (
      <Router>
        <Fragment>
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact path="/manage" component={Manage} />
          <Route exact path="/signin" component={Sign} />
          <Route exact path="/signup" component={Sign} />
        </Fragment>
      </Router>
    );
  }
}
export default App;
