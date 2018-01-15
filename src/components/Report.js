import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import moment from 'moment';
import { Card, Row, Col, Table, Spin, Breadcrumb, Icon, DatePicker, Alert, Button } from 'antd';
import styles from './styles.css';

const { MonthPicker }  = DatePicker;

class Report extends Component {

  //  构建函数
  constructor(props) {
    super(props);
    this.state = {
      location:[{
        label: '全省',
        value: '610000',
      }]
    }
  }

  componentWillMount() {
    //　设置默认参数
    this.props.dispatch({
      type: 'report/setParams',
      payload: {
        reportId: this.props.code,
        params: {
          ...this.props.defaultParams,
        }
      }
    });
  }

  componentDidMount() {
    // 取控件数据
    this.props.dispatch({
      type: 'report/getData',
      payload: {
        reportId: this.props.code
      }
    });
  }

  // 如果参数变化重新取数
  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading && (nextProps.params !== this.props.params)) {
      this.props.dispatch({
        type: 'report/getData',
        payload: {
          reportId: this.props.code,
        }
      });
    }
  }


  render() {
    const columns = [];
    let data = [];
    if (this.props.data){
      for (const index in this.props.data.columns){
        if (this.props.data.branch_level === 'T'||index > 0) {
          let i = parseInt(index) + 1;
          columns.push({
            title:  this.props.data.columns[index],
            dataIndex: `d${i}`,
            key: `d${i}`,
            fixed: i===2 ?'left':''
          });
        }
      }
      data = this.props.data.report;
    }
    return (
      <Spin spinning={this.props.loading} size="large" tip="加载中...">
        <Card loading={this.props.loading} title={this.props.title}>
        <div className={styles.report}>
          <Alert style={{ marginBottom: '16px' }}  message={
            <div>
            <Row gutter={40} style={{ marginBottom: '16px' }}>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                {
                  this.props.dateType === 'M' &&
                    <MonthPicker
                      allowClear={false}
                      value={this.props.params?moment(this.props.params.begin_date, 'YYYY-MM'):moment()}
                      onChange={(date, dateString)=>{
                        //　设置参数
                        this.props.dispatch({
                          type: 'report/setParams',
                          payload: {
                            reportId: this.props.code,
                            params: {
                              begin_date: dateString,
                            }
                          }
                        });
                      }} />
                }
                {
                  this.props.dateType !== 'M' &&
                    <DatePicker
                      allowClear={false}
                      value={this.props.params?moment(this.props.params.begin_date, 'YYYY-MM-DD'):moment()}
                      onChange={(date, dateString)=>{
                        //　设置参数
                        this.props.dispatch({
                          type: 'report/setParams',
                          payload: {
                            reportId: this.props.code,
                            params: {
                              begin_date: dateString,
                            }
                          }
                        });
                      }} />
                }
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                {
                  this.props.dateType === 'M' &&
                  <MonthPicker
                    allowClear={false}
                    value={this.props.params?moment(this.props.params.end_date, 'YYYY-MM'):moment()}
                    onChange={(date, dateString)=>{
                      //　设置参数
                      this.props.dispatch({
                        type: 'report/setParams',
                        payload: {
                          reportId: this.props.code,
                          params: {
                            end_date: dateString,
                          }
                        }
                      });
                    }} />
                }
                {
                  this.props.dateType !== 'M' &&
                  <DatePicker
                    allowClear={false}
                    value={this.props.params?moment(this.props.params.end_date, 'YYYY-MM-DD'):moment()}
                    onChange={(date, dateString)=>{
                      //　设置参数
                      this.props.dispatch({
                        type: 'report/setParams',
                        payload: {
                          reportId: this.props.code,
                          params: {
                            end_date: dateString,
                          }
                        }
                      });
                    }} />
                }              
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right'}}>
                <Button type="primary" icon="reload" loading={this.props.iconLoading} onClick={()=>{
                  this.props.dispatch({
                      type: 'report/getData',
                      payload: {
                        reportId: this.props.code,
                      }
                    });
                  }}>
                  刷新
                </Button>
              </Col>
            </Row>
            </div>}
          />
          <Alert style={{ marginBottom: '16px' }}  message={
            <Breadcrumb>
            {
              this.state.location && this.state.location.map((l,index)=>
                <Breadcrumb.Item key={index} onClick={()=>{
                  // 删除机构
                  const location = [];
                  for(let loc of this.state.location){
                    location.push(loc);
                    if (l.value === loc.value) {
                      break;
                    }
                  }

                this.setState({
                  location,
                });
                //　设置参数
                this.props.dispatch({
                    type: 'report/setParams',
                    payload: {
                      reportId: this.props.code,
                      params: {
                        branch: l.value,
                      }
                    }
                  });
                }}>
                  <span>{l.label}</span>
                </Breadcrumb.Item>
              )
            }
            </Breadcrumb>

          } />
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey="d1"
            size="small"
            bordered
            scroll={this.props.scroll}
            onRowClick={(record, index)=>{
              if (this.props.drillLevel.indexOf(this.props.data.branch_level) >= 0) {
                  this.setState({
                    location: [...this.state.location,{label: record.d2,value: record.d1}]
                  });
                  //　设置参数
                  this.props.dispatch({
                    type: 'report/setParams',
                    payload: {
                      reportId: this.props.code,
                      params: {
                        branch: record.d1,
                      }
                    }
                  });
                }}
              }
          />
        </div>
      </Card>
      </Spin>
    );
  }
}


Report.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ report }, { code }) => ({
  params: report.params[code],
  data: report.data[code],
  loading: report.loading[code],
}))(Report)
