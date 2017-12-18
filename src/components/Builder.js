import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('commonStore')
@observer
class Builder extends React.Component {
  render() {
    return (
      <div>
        Builder
      </div>
    );
  }
}

export default Builder;