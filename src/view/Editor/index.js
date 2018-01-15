// import ArticleList from './ArticleList';
import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { withRouter, NavLink } from 'react-router-dom'
import _superagent from 'superagent';
import Head from './../../components/Header'
import CreateBase from './../../components/CreateBase'
import MySql from './../../components/MySql'
import Common from './../../components/Common'
import { Row, Col,Table,Input,Card,Checkbox,Select ,Cascader,DatePicker,Transfer ,Button,Tabs} from 'antd';
const TabPane = Tabs.TabPane;
//const URL = '/api/report-builder/';
 const URL = '/';
@inject('commonStore')
@observer
export default class Editor extends React.Component {
	state={
		cr:false
	}
  componentWillMount() {
    // this.props.articlesStore.setPredicate(this.getPredicate());
	  console.log(this.props.commonStore.code)
  }

  componentDidMount() {
    // this.props.articlesStore.loadArticles();
  }

  componentDidUpdate(previousProps) {
  
  }
	createTable(){
		_superagent
		.put(URL+''+this.props.commonStore.code+'/table')
		.set("Content-Type", "application/json")
		.then(res=>{
			if(res.body.code == 0){
				this.setState({
				cr:true
			})
			}else {
				alert(res.body.msg)
			}
		})
	}
	callback(key) {
	  console.log(key);
	}
  render() {
	  console.log(this.props.commonStore.code)
    return (
     	<div>
			<Head />
		 	<div style={{padding:'20px',paddingBottom:'0'}}>
				<Row>
          			<Col span={12}>
						 <Tabs onChange={e=>this.callback(e)} type="card">
							<TabPane tab="指标库生成" key="1">
								<CreateBase />
							</TabPane>
							<TabPane tab="自定义SQL" key="2">
								<MySql />
							</TabPane>
							<TabPane tab="静态数据" key="3">不需要从数据库取数的静态数据。</TabPane>
							<TabPane tab="API" key="4">开发接口程序根据参数返回报表数据。</TabPane>
						  </Tabs>
         			</Col>
          			<Col span={12}>
          				<Common code={this.props.commonStore.code} />
					  	{this.props.commonStore.code  && <div>
					  		
							<p style={{textAlign:'center',marginTop:'10px'}}>
         						<Button type="primary" onClick={()=>this.createTable()}>确定生成报表</Button>
         					</p>
         					{this.state.cr && this.props.commonStore.code !=0 && <Card  bordered={true}>
								<p style={{marginTop:'10px'}}>配置路径：{this.props.commonStore.code}</p>
         						<a href={'http://10.184.1.8/repb/#/test?code='+this.props.commonStore.code} target='_blank'>分享链接：{'http://10.184.1.8/repb/#/test?code='+this.props.commonStore.code}</a>
							</Card>	}
						</div>	
						}
          			</Col>
				</Row>
			</div>
     	</div>	
    );
  }
};
