import Header from './Header';
import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import Home from './Home';

@inject('commonStore')
@withRouter
@observer
export default class App extends React.Component {

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route path="/" component={Home} />
        </Switch>
      </div>
    );
  }
}