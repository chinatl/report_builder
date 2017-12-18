import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('userStore', 'commonStore')
@observer
class ReportViewer extends React.Component {
  render() {
    return (
      <div>
        ReportViewer
      </div>
    );
  }
}

export default ReportViewer;