import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col,Table,Input,Card,Checkbox,Select ,Cascader,Transfer ,Button,Tabs,Switch} from 'antd';
import _superagent from 'superagent';
import Pol from '../../assets/data/pol.json'
import './index.css';
const { Column, ColumnGroup } = Table;
const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;
const Option = Select.Option;
// const URL = ''
// const URL = '/api/report-builder/'
@inject('commonStore')
@observer

export default class CreateBase extends React.Component {
	state = {
		branchCode:['610000', '610000', '610000'],
		branchChecked:false,
		branchTxt:'@branch',
		dateType:'day',
		dateTime:'0',
		dateTime1:"0",
		dateTxt:'@begin_date',
		dateTxt1:'@end_date',
		dateChecked:false,
		tableArr:[
			{columns:"机构号"},
			{columns:"机构"},
		],
		tableArrData:["机构号","机构"],
		isAll:0,
		dataSource:'1',
		sql_str:'',
		channel:'1,2,3',
		channelTxt:'@sales_channel',
		channelChecked:false,
		insuranceChecked:false,
		insuranceTxt:'@pol',
        insuranceArr:[],
		branch_level_down:'N',
		code:0,
		targetKeys: [],
		nextDate:false,
		title:'',
		remark:'',
		branch:[]
	}
	 componentWillMount() {
		  _superagent
		.get('./branch.json')
		.set("Content-Type", "application/json")
		 .set('Accept',"application/json")
		  .then(res=>{
			  this.setState({
				  branch:res.body
			  })
		  })
	 }
	renderFooter = () => {
		return (
		  <Button
			size="small"
			style={{ float: 'right', margin: 5 }}
			onClick={()=>this.getMock()}
		  >
			重置
		  </Button>
		);
	}
	getMock(){
		this.setState({ targetKeys:[]});
		var arr = this.state.sql_str;
		this.setState({
			sql_str:arr
		})
	}
	handleChange(value) {
		this.refs.year.style.display = 'none';
		this.refs.month.style.display = 'none';
		this.refs.day.style.display = 'none';
		this.refs[value].style.display = 'block';
		this.setState({
			dateType:value
		})
		this.setState({
			dateTime:0
		})
	}	
	handleChange1(value) {
		this.refs.year1.style.display = 'none';
		this.refs.month1.style.display = 'none';
		this.refs.day1.style.display = 'none';
		this.refs[value+'1'].style.display = 'block';
		this.setState({
			dateType1:value
		})
		this.setState({
			dateTime1:0
		})
	}//切换年月日
	handleChangeTable(e){
		if(e){
			this.setState({
				tableArrData:e
			})
			var len = e.length;
			var dataArr = [];
			for(var i=0;i<len;i++){
				dataArr[i]={};
				dataArr[i].columns = e[i];
			}
			this.setState({
				tableArr:dataArr
			})
			
		}
	}
	checkSql(str){
		var arr = this.state.sql_str;
		if(arr.indexOf(str)===-1){
			return true
		}
		if(!str){
			return true
		}
	}
	checkedSql(){
		var arr = this.state.sql_str;
		if(arr.indexOf('delete')!=-1 ||
		   arr.indexOf('create')!=-1 ||
		   arr.indexOf('insert')!=-1 ||
		   arr.indexOf('update')!=-1 && 
		   arr.indexOf('set')!=-1 
		  ){
			return true
		}
	}
	createTable(){
		var code = this.state.code;
		_superagent
		.put(+code+'/table')
		.set("Content-Type", "application/json")
		.then(res=>{
			alert('生成成功');	
		})
	}
	pushData(){
		var dataObj = {
			"term_info":[],
			"columns_str":[],
			"data_source":"",
			"is_total":"",
			"sql_str":'',
			"title":'',
			"remark":''
		}
		dataObj.sql_str = this.state.sql_str;//select语句
		dataObj.is_total = this.state.isAll;//是否合计
		dataObj.data_source = this.state.dataSource;//数据源
		dataObj.columns_str = this.state.tableArr;//表头
		dataObj.branch_level_down = this.state.branch_level_down;//表头
		dataObj.title = this.state.title;//表头
		dataObj.remark = this.state.remark;//表头
		dataObj.idc_ids = [];//表头
		dataObj.pid = localStorage.getItem('pid');//表头
		if(this.checkedSql()){
			alert('sql格式非法');
			return 
		}
		if(!this.state.tableArr.length){
			alert('请输入表头');
			return 
		}
		var term_info = [];
		if(this.state.branchChecked){
			var len0 = term_info.length;
			term_info[len0] = {};
			term_info[len0].name = 'p'+len0;
			term_info[len0].type = '1';
			term_info[len0].title = '机构';
			term_info[len0].default = this.state.branchCode;
			term_info[len0].optional = '';
			term_info[len0].param_str = this.state.branchTxt;
			if(this.checkSql(this.state.branchTxt)){
				return 
			}
			var x = this.state.branchCode[2];
			if(this.state.branch_level_down === 'P'){
				if(x !== '610000'){
					alert('只能下钻到市')
					return 
				}
			}else {
				
				if(x[4]!=="0" || x[5]!=="0"){
					alert('只能下钻到县');
					return 
				}
			}
		}
		if(this.state.dateChecked){
			var len1 = term_info.length;
			term_info[len1] = {};	
			term_info[len1].name = 'p'+len1;
			term_info[len1].type = '4';
			term_info[len1].title = this.state.dateChecked && this.state.nextDate ? '开始日期':'日期'
			term_info[len1].default = this.state.dateTime+'';
			term_info[len1].optional = this.state.dateType === 'year'?1: this.state.dateType==='month'?2:3;
			term_info[len1].param_str = this.state.dateTxt;
			if(this.checkSql(this.state.dateTxt)){
				console.log(this.state.dateTxt)
				return 
			}
		}	
		if(this.state.dateChecked && this.state.nextDate){
			var len1 = term_info.length;
			term_info[len1] = {};	
			term_info[len1].name = 'p'+len1;
			term_info[len1].type = '4';
			term_info[len1].title = '结束日期';
			term_info[len1].default = this.state.dateTime1+'';
			console.log(this.state.dateType1)
			term_info[len1].optional = this.state.dateType === 'year'?1: this.state.dateType1==='month'?2:3;
			term_info[len1].param_str = this.state.dateTxt1;
			if(this.checkSql(this.state.dateTxt1)){
				return 
			}
		}
		if(this.state.channelChecked){
			var len2 = term_info.length;
			term_info[len2] = {};
			term_info[len2].name = 'p'+len2;
			term_info[len2].type = '2';
			term_info[len2].title = '渠道';
			term_info[len2].default = this.state.channel;
			term_info[len2].optional = "1,2,3-全部 1-团险 2-个险 3-银保";
			term_info[len2].param_str = this.state.channelTxt;
			if(this.checkSql(this.state.channelTxt)){
				return 
			}
		}
        if(this.state.insuranceChecked){
            var len = term_info.length;
			term_info[len] = {};
			term_info[len].name = 'p'+len;
			term_info[len].type = '3';
			term_info[len].title = '险种';
            var arr = this.state.insuranceArr;
			var defaultParam = [];
            for(var i =0;i<arr.length;i++){
               defaultParam.push(arr[i].split('-')[0])
            }
			term_info[len].default = defaultParam.join(',');
			term_info[len].optional = arr.join(' ');
			term_info[len].param_str = this.state.insuranceTxt;
			if(this.checkSql(this.state.insuranceTxt)){
				return 
			}
        }
		dataObj.term_info = term_info;
		this.props.commonStore.setCode(dataObj)
		console.log(JSON.stringify(dataObj))
	}
  	render() {
    	return (
		 	<Row>
			   <Col span={22}>
				<Card bordered={true} style={{margin:'10px'}} title='参数设置'>
					<div>
						<div className='defaultTitle'>
							<Switch onChange={e=>{
									this.setState({
										dateChecked:e
									})
								}}/>
							<span className='title'>{this.state.nextDate && '开始日期'|| '日期'}</span>
							<span style={{margin:'0 10px'}}>是否选择区间</span>
							<Checkbox onChange={e=>{
								this.setState({
									nextDate:e.target.checked
								})
							}}></Checkbox>
						</div>
						<div className='default'>
							<div>默认值：</div>
							<div>
								<Select defaultValue="day" style={{ width: 60 }} onChange={e=>this.handleChange(e)}>
								  <Option value="year">年</Option>
								  <Option value="month">月</Option>
								  <Option value="day">日</Option>
								</Select>
							</div>
							<div>
								<div ref='year' style={{display:'none'}}>
									<Select defaultValue="0" style={{ width: 100 }} onChange={e=>{
											console.log(e)
											this.setState({
												dateTime:e
											})}}>
									  <Option value="0">今年</Option>
									  <Option value="1">去年</Option>
									</Select>
								</div>
								<div ref='month'  style={{display:'none'}}  defaultValue="0">
									<Select defaultValue="0" style={{ width: 100 }} onChange={e=>this.setState({
										dateTime:e
									})}>
									  <Option value="0">本月</Option>
									  <Option value="1">上月</Option>

									</Select>
								</div>
								<div ref='day'>
									<Select style={{ width: 100 }} defaultValue="0" onChange={e=>this.setState({
										dateTime:e
									})}>
									  <Option value="0">年初</Option>
									  <Option value="1">年末</Option>
									  <Option value="3">月初</Option>
									  <Option value="4">月末</Option>
									  <Option value="5">当日</Option>
									</Select>
								</div>
							</div>
						</div>
						<div className='default'>
							<div>参数名称：</div>
							<Input placeholder='参数名称'
								value={this.state.dateTxt}
								onChange={e=>this.setState({ dateTxt: e.target.value.replace(/^\s\s*/, '')})}
								 style={{width:'120px'}} />
						</div>
				  </div>
				  	{
						this.state.dateChecked && this.state.nextDate && 
					(<div>
						<div className='defaultTitle'>
							<Switch disabled defaultChecked />
							<span className='title'>结束日期</span>
						</div>
						<div className='default'>
							<div>默认值：</div>
							<div>
							{
								this.state.dateType === 'year' &&
									(<Select value={this.state.dateTime1} style={{ width: 100 }} onChange={e=>{
										this.setState({
											dateTime1:e
										})}}>
									  <Option value="0">今年</Option>
									  <Option value="1">去年</Option>
									</Select>) ||
								this.state.dateType === 'month' && 
									(<Select value={this.state.dateTime1} style={{ width: 100 }} onChange={e=>this.setState({
										dateTime1:e
									})}>
									  <Option value="0">本月</Option>
									  <Option value="1">上月</Option>
									</Select>) || 
								this.state.dateType == 'day' && 
									(<Select value={this.state.dateTime1} style={{ width: 100 }} onChange={e=>this.setState({
										dateTime1:e
									})}>
									  <Option value="0">年初</Option>
									  <Option value="1">年末</Option>
									  <Option value="3">月初</Option>
									  <Option value="4">月末</Option>
									  <Option value="5">当日</Option>
									</Select>)
								}
							</div>
						</div>
						<div className='default'>
							<div>参数名称：</div>
							<Input placeholder='参数名称'
								value={this.state.dateTxt1}
								onChange={e=>this.setState({ dateTxt1: e.target.value.replace(/^\s\s*/, '')})}
								 style={{width:'120px'}} />
						</div>
				  </div>)
					}
					<div>
						<div className='defaultTitle'>
							<Switch  onChange={e=>{
									this.setState({
										channelChecked:e
									})
								}}/>
							<span className='title'>渠道</span>
						</div>
						<div className='default'>
							<div>默认值：</div>
							<div>
								<Select defaultValue="1,2,3" style={{ width: 100 }} onChange={e=>this.setState({
									channel:e
								})}>
								  <Option value="1,2,3">全部</Option>
								  <Option value="1">团险</Option>
								  <Option value="2">个险</Option>
								  <Option value="3">银保</Option>
								</Select>
							</div>
						</div>
						<div className='default'>
							<div>参数名称：</div>
							<Input placeholder='参数名称' value={this.state.channelTxt} onChange={e=>this.setState({
                                channelTxt:e.target.value
                            })}style={{width:'100px'}} />
						</div>
					</div>
					<div>
						<div className='defaultTitle'>
							<Switch  onChange={e=>{
									this.setState({
										branchChecked:e
									})
								}}/>
							<span className='title'>机构</span>
						</div>
						<div className='default'>
							<div>默认值：</div>
							<Cascader options={this.state.branch} 
							onChange={ e=>{
                                if(e){
                                    this.setState({
                                        branchCode:e
                                    })
                                }
								
                             }}
							defaultValue={['610000', '610000', '610000']}  placeholder="Please select" style={{width: 240}}/>
						</div>
						<div  className='default'>
							<div>参数名称：</div>
							<Input placeholder='参数名称'
							value={this.state.branchTxt}
                             onChange={e=>this.setState({ branchTxt: e.target.value})}
							 style={{width:'120px'}} />
						</div>
					</div>
					<div>
						<div className='defaultTitle'>
							<Switch  onChange={e=>{
									this.setState({
										insuranceChecked:e
									})
								}}/>
							<span className='title'>险种</span>
							<span style={{margin:'0 10px'}}>是否全选</span>
							<Checkbox></Checkbox>
						</div>
						<div className='default'>
							<div>默认值：</div>
							<Select 
							key='x'
							maxTagCount={4}
							mode="multiple" style={{ width: '70%' }}placeholder="请选择"
							onChange={e=>{
									if(e.length){
										this.setState({
											insuranceArr:e
										})
										
									}
							}}>
								{
								  Pol.map((e,i)=>{
									  return <Option value={e.pol_code+'-'+e.pol_name} key={'a' + 'i'}>{e.pol_name}</Option>
								  })
							  }
						</Select>
						</div>
						<div  className='default'>
							<div>参数名称：</div>
							<Input placeholder='参数名称'
							value={this.state.insuranceTxt}
                             onChange={e=>this.setState({ insuranceTxt: e.target.value})}
							 style={{width:'120px'}} />
						</div>
					</div>
				</Card>
			   </Col>  
		      <Col span={22}>
				<Card bordered={true} style={{margin:'10px'}} title='表格设置'>
					<div className='defaultTitle' style={{marginBottom:'10px'}}>
						<div>设置大标题：</div>
						<Input placeholder='大标题'
						 onChange={e=>this.setState({ title: e.target.value})}
						 style={{width:'400px'}} />
					</div>
					<div><span >请输入一级表头：</span> 
						 <Select
							mode="tags"
							style={{ width: '70%' }}
							placeholder="请选择或输入表头，回车确认。"
							value={this.state.tableArrData}
							onChange={(e)=>this.handleChangeTable(e)}
						  >
							<Option key='保费'>保费</Option>
							<Option key='机构号'>机构号</Option>
							<Option key='机构'>机构</Option>
						  </Select>
					</div>
						{this.state.tableArr.map((e,index)=>{
						return (<div key={index} style={{marginTop:'8px'}}>
							<div style={{marginLeft:'30px'}}>输入{(<span style={{fontWeight:'bold',color:'#000'}}>{e.columns}</span>)}的二级表头：
						 <Select
							mode="tags"
							style={{ width: '50%'}}
							placeholder="请输入二级表头"
							onChange={(e)=>{
								var arr = this.state.tableArr;
								arr[index].children = e;
								this.setState({
									tableArr:arr
								})
							}}
						 ></Select></div>
						</div>)
					})}
					<div style={{marginTop:'10px'}}>
						<span>下钻级别：</span>
						 <Select defaultValue="N" style={{ width: 120 }} 
                                onChange={e=>{
								this.setState({
									branch_level_down:e
								})
								}}>
						  <Option value="N">不下钻</Option>
						  <Option value="P">市</Option>
						  <Option value="C">县</Option>
						</Select>
					</div>
					<div style={{marginTop:'10px'}}>
						<span>是否合计：</span><Checkbox 
								onChange={e=>this.setState({
                                    isAll:e.target.checked?1:0
                                })}
							></Checkbox>
					</div>
				</Card>
			   </Col> 
			  <Col span={22}>
				<Card title="请输入备注" bordered={true} style={{margin:'10px'}}>
					<TextArea 
		                    placeholder="" 
					    	value = {this.state.remark}
						    autosize={{ minRows: 5, maxRows: 9 }}
							onChange={e=>{
								this.setState({
									remark:e.target.value
								})
							}}
						  />
				</Card>
			  </Col>
			   <Col span={22}>
				<Card title="请输入查询语句" bordered={true} style={{margin:'10px'}}
					   extra={
						  	<div>
						  		<span>请输入数据源：</span> 
                            <Select defaultValue="1" style={{ width: 120 }} 
                                onChange={e=>this.setState({
                                        dataSource:e
                                    })}>
								  <Option value="1">102</Option>
								</Select>
								
							</div>
					 }>
					<TextArea 
		                    placeholder="SELECT  m_i_d.idc_code,f_i_a.key_amnt value FROM  f_idc_amnt  f_i_a
							LEFT JOIN d_idc_def  m_i_d
							ON f_i_a.idc_id=m_i_d.idc_id
							WHERE
							f_i_a.town_branch_code=@branch
							AND f_i_a.key_date_id=@strTime
							AND m_i_d.idc_code IN (@idcCode)" 
					    	value = {this.state.sql_str}
						    autosize={{ minRows: 5, maxRows: 9 }}
							onChange={e=>{
							console.log(e.target.value)
								this.setState({
									sql_str:e.target.value
								})
							}}
						  />
				</Card>
			  </Col>
			  <Col span={22}>
				  <p style={{textAlign:'center'}}><Button type="primary" onClick={()=>this.pushData()}>预览</Button></p>
			  </Col>
			</Row>
    );
  }
}





