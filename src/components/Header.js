import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('commonStore')
@observer
class Header extends React.Component {
  render() {
    return (
      <nav>
        <div>
          {this.props.commonStore.appName.toLowerCase()}
        </div>
      </nav>
    );
  }
}

export default Header;