import React, { Fragment } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import Home from './home';
import Sign from './sign';
import Manage from './manage';
class App extends React.Component {
  render() {
    return (
      <Router>
        <Fragment>
          <Route exact path="/" component={Home} />
          <Route exact path="/signin" component={Sign} />
          <Route exact path="/signup" component={Sign} />
          <Route exact path="/manage" component={Manage} />
        </Fragment>
      </Router>
    );
  }
}
export default App;
