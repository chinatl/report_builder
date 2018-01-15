// import ArticleList from './ArticleList';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, NavLink } from 'react-router-dom'
import { Table } from 'antd';
import { parse as qsParse } from 'query-string';

export default class MainView extends React.Component {

  componentWillMount() {
	  console.log(this.props.location)
    // this.props.articlesStore.setPredicate(this.getPredicate());
  }

  componentDidMount() {
    // this.props.articlesStore.loadArticles();
  }

  componentDidUpdate(previousProps) {
  
  }

  render() {
  const datasource = [{
		  key: '1',
		  name: '胡彦斌',
		  age: 32,
		  address: '西湖区湖底公园1号'
		}, {
		  key: '2',
		  name: '胡彦祖',
		  age: 42,
		  address: '西湖区湖底公园1号'
		}];
		  const columns = [{
		  title: '姓名',
		  dataIndex: 'name',
		  key: 'name',
		}, {
		  title: '年龄',
		  dataIndex: 'age',
		  key: 'age',
		}, {
		  title: '住址',
		  dataIndex: 'address',
		  key: 'address',
		}];

    return (
      <div className="col-md-12">
       	<div style={{borderTop:'2px solid #5CB85C',width:'100%',marginTop:'10px'}}>
			<Table dataSource={datasource} columns={columns} />
       	</div>
      </div>
    );
  }
};
