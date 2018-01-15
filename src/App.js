import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import editor from './view/Editor';
import Login from './view/Login';
import Test from './view/Test';

@inject('commonStore',"userStore")
@withRouter
@observer
export default class App extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/editor" component={editor} />
          <Route path="/test" component={Test} />
          <Route path="/" component={Login} />
        </Switch>
      </div>
    );
  }
}