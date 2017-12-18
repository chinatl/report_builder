import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col} from 'antd';

@inject('commonStore')
@observer
class Home extends React.Component {
  render() {
    return (
      <div>
        <Row>
          <Col span={12}>col-12</Col>
          <Col span={12}>col-12</Col>
        </Row>
      </div>
    );
  }
}

export default Home;