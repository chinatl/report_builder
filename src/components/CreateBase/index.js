import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col,Table,Input,Card,Checkbox,Select ,Cascader,Transfer ,Button,Tabs,Switch} from 'antd';
import _superagent from 'superagent';
import './index.css';
const { Column, ColumnGroup } = Table;
const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;
const Option = Select.Option;

@inject('commonStore')
@observer

export default class CreateBase extends React.Component {
	state = {
		branchCode:['610000', '610000', '610000'],
		dateType:'day',
		dateTime:0,
		dateTime1:'0',
		tableArr:[
			{columns:"机构号"},
			{columns:"机构"},
		],
		tableArrData:["机构号","机构"],
		isAll:'1',
		dataSource:'1',
		sql_str:'',
		branch_level_down:'N',
		code:0,
		targetKeys: [],
		nextDate:false,
		dateCondition:'and d.[YEAR] = @begin_date',
		nortarget:'',
		idc_ids:[],
		title:'',
		remark:"",
		branch:[],
		havingSum:''
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
		 _superagent
		.get('./idc.json')
		.set("Content-Type", "application/json")
		 .set('Accept',"application/json")
		.then(res=>{
			 console.log(res)
			if(res.body){
				var data = res.body;
				var newArr = [];
				for(var i = 0;i<data.length;i++){
					newArr.push(data[i]);
					newArr.push({idc_id:'LY'+data[i].idc_id,idc_name:data[i].idc_name+''+'同期数'})
					newArr.push({idc_id:'LYP'+data[i].idc_id,idc_name:data[i].idc_name+''+'同比'})
					if( data[i].task){
						var arr = data[i].task;
						for(var j = 0;j <arr.length;j++){
							if(arr[j] ==='Y'){
								newArr.push({idc_id:'TY'+data[i].idc_id,idc_name:data[i].idc_name+''+'年计划数'});
								newArr.push({idc_id:'PY'+data[i].idc_id,idc_name:data[i].idc_name+''+'年完成比'});
							}
							if(arr[j] ==='Q'){
								newArr.push({idc_id:'TQ'+data[i].idc_id,idc_name:data[i].idc_name+''+'季度计划数'});
								newArr.push({idc_id:'PQ'+data[i].idc_id,idc_name:data[i].idc_name+''+'季度完成比'});
							}
						}
					}
				}
				this.setState({
					idc:newArr
				})
			}
		})
	 }
 	handleChangeX = (targetKeys) => {
		var tableArrData = this.state.tableArrData;
		var idc_idsArr = [];
		for (let t in targetKeys){
			if(targetKeys[t]-0+'' !== 'NaN'){
				idc_idsArr.push(targetKeys[t])
			}
		}//只取真实指标 不取衍生指标
		console.log(idc_idsArr)
		this.setState({
			idc_ids:idc_idsArr
		})
		var Arr = [];
		for(var k =0;k<this.state.idc.length;k++){
			for(var j =0;j<targetKeys.length;j++){
				if(targetKeys[j] === this.state.idc[k].idc_id){
					Arr.push(this.state.idc[k].idc_name)
				}
			}
		}
		for(var i = 0;i<Arr.length;i++){
			console.log(tableArrData.indexOf(Arr[i]))
			if(tableArrData.indexOf(Arr[i]) === -1){
				tableArrData.push(Arr[i])
			}
		}
		this.setState({
			tableArrData:tableArrData
		})
		this.handleChangeTable(tableArrData)
    	this.setState({ targetKeys });
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
		this.setState({
			tableArr:[
			{columns:"机构号"},
			{columns:"机构"},
			],
			tableArrData:["机构号","机构"],
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
		if(arr.sql.indexOf(str)===-1){
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
	pushData(){
		var dataObj = {
			"term_info":[],
			"columns_str":[],
			"data_source":"",
			"is_total":"",
			"sql_str":"",
			"title":"",
			"idc_ids":[],
			"remark":"",
		}
		dataObj.is_total = this.state.isAll;//是否合计
		dataObj.data_source = this.state.dataSource;//数据源
		dataObj.columns_str = this.state.tableArr;//表头
		dataObj.branch_level_down = this.state.branch_level_down;//下转级别
		dataObj.title = this.state.title;//标题
		dataObj.idc_ids = this.state.idc_ids;//指标
		dataObj.remark = this.state.remark;//备注
		dataObj.pid = localStorage.getItem('pid');//表头
		
		var dateCondition = '';
		var dateCondition_ly = '';
		if(this.state.dateType==='year'&& this.state.nextDate === false){
			console.log(1)
			dateCondition = ' and d.[YEAR] = @begin_date';
			dateCondition_ly = ' and d.[YEAR] = substring(CONVERT(VARCHAR(100),dateadd(YEAR,-1,cast(@begin_date as datetime)),112),1,4)';
		}else if(this.state.dateType === 'month' && this.state.nextDate === false){
			console.log(2)
			dateCondition = " and d.[key_date_id]  between cast(@begin_date+'00' as int)  and cast(@begin_date+'99' as int)";
			dateCondition_ly = " and d.[key_date_id]  between cast(substring(CONVERT(VARCHAR(100),dateadd(YEAR,-1,cast(@begin_date as datetime)),112),1,6)+'00' as int)  and cast( substring(CONVERT(VARCHAR(100),dateadd(YEAR,-1,cast(@begin_date as datetime)),112),1,6)+'99' as int)"
		}else if(this.state.dateType === 'day' && this.state.nextDate === false){
			console.log(3)
			dateCondition = " and d.[key_date_id]  = @begin_date";
			dateCondition_ly = " and d.[key_date_id]  =  substring(CONVERT(VARCHAR(100),dateadd(YEAR,-1,cast(@begin_date as datetime)),112),1,8)";
		}else if(this.state.dateType === 'year' && this.state.nextDate === true){
			console.log(4)
			dateCondition = " and d.[YEAR] between @begin_date and @end_date";
			dateCondition_ly = " and d.[YEAR] between  substring(CONVERT(VARCHAR(100),dateadd(YEAR,-1,cast(@begin_date as datetime)),112),1,4) and  substring(CONVERT(VARCHAR(100),dateadd(YEAR,-1,cast(@end_date as datetime)),112),1,4)"
		}else if(this.state.dateType === 'month' && this.state.nextDate === true){
			console.log(5)
			dateCondition = " and d.[key_date_id]  between cast(@begin_date+'00' as int)  and cast(@end_date+'99' as int)";
			dateCondition_ly = " and d.[key_date_id]  between cast(substring(CONVERT(VARCHAR(100),dateadd(YEAR,-1,cast(@begin_date as datetime)),112),1,6)+'00' as int)  and cast(substring(CONVERT(VARCHAR(100),dateadd(YEAR,-1,cast(@end_date as datetime)),112),1,6)+'99' as int)";
		}else if(this.state.dateType === 'day' && this.state.nextDate === true){
			console.log(6)
			dateCondition = " and d.[key_date_id]  between @begin_date and @end_date";
			dateCondition_ly = " and d.[key_date_id]  between substring(CONVERT(VARCHAR(100),dateadd(YEAR,-1,cast(@begin_date as datetime)),112),1,8) and substring(CONVERT(VARCHAR(100),dateadd(YEAR,-1,cast(@end_date as datetime)),112),1,8)"
		}
		
		var targetKeys  = this.state.targetKeys;
		var newArr = [];
		var newArrHaving = [];
		var data_type = this.state.dateType === "year" ? 'Y': this.state.dateType === "month" ? 'M' : 'D';
		var endData = this.state.nextDate ? '@end_date' : "null";
		if(targetKeys.length){
			for(var j = 0;j<targetKeys.length;j++){
				if(targetKeys[j][0]=== 'T'){
					newArr.push(`edecision.dbo.get_task(b.[city_branch_code],${targetKeys[j].slice(2)},'${targetKeys[j][1]}') as c_${targetKeys[j]}`)
				}else if(targetKeys[j][0]=== 'P'){
					newArr.push(`edecision.dbo.get_task_progress(b.[city_branch_code],${targetKeys[j].slice(2)},'${targetKeys[j][1]}',
							sum (case when idc_id= ${targetKeys[j].slice(2)} then key_amnt else 0 end)) as c_${targetKeys[j]}`)
				}else if(targetKeys[j][0]=== 'L' && targetKeys[j][2] !== 'P'){//LY+ID 同期数
					newArr.push('sum (case when idc_id= '+targetKeys[j].slice(2)+ dateCondition_ly +' then key_amnt else 0 end) as c_'+targetKeys[j])
					//newArr.push(`edecision.dbo.get_idc_value_lastyear(b.[city_branch_code],${targettKeys[j].slice(2)},'${data_type}', @begin_date ,${endData}) as c_${targetKeys[j]}`)
				}else if(targetKeys[j][0]=== 'L' && targetKeys[j][2] === 'P') { //同比
					//(case when @value> 0 then cast(cast(((@arg_current-@value)/@value *100) as DECIMAL(10,2)) AS VARCHAR) else '0' end) +'%'
					//newArr.push(`edecision.dbo.get_idc_value_lastyear_percent(${'sum (case when idc_id= '+targetKeys[j].slice(3)+' then key_amnt else 0 end)'},b.[city_branch_code],${targetKeys[j].slice(3)},'${data_type}', @begin_date ,${endData}) as c_${targetKeys[j]}`)
					let lastAmnt = 'sum (case when idc_id= '+targetKeys[j].slice(3)+ dateCondition_ly +' then key_amnt else 0 end) ';
					let curAmnt = 'sum (case when idc_id= '+targetKeys[j].slice(3)+ dateCondition +' then key_amnt else 0 end) ';
					newArr.push(`(case when ${lastAmnt}> 0 then cast(cast(((${curAmnt}-${lastAmnt})/${lastAmnt} *100) as DECIMAL(10,2)) AS VARCHAR) else '0' end)` +"+'%' "+'as c_'+targetKeys[j]);
				
				}
				else {
					newArr.push('sum (case when idc_id= '+targetKeys[j]+ dateCondition +' then key_amnt else 0 end) as c_'+targetKeys[j])
					newArrHaving.push('sum (case when idc_id= '+targetKeys[j]+' then key_amnt else 0 end)');
				}
			}
		}
		var havingSum = 'having '+newArrHaving.join('+','\n')+'> 0';
		var nortarget = newArr.join(',\n');
		if(this.checkedSql()){
			alert('sql格式非法');
			return 
		}
		if(!this.state.tableArr.length){
			alert('请输入表头');
			return 
		}
		
		var str = `select b.[CITY_BRANCH_CODE], b.[CITY_BRANCH_ALIAS],
${nortarget}
from edecision.dbo.f_idc_amnt f
left join edecision.dbo.d_date d on f.key_date_id = d.key_date_id
left join edecision.dbo.d_branch b on f.town_branch_code = b.town_branch_code
where 1=1
and b.levelno = 3
and b.prov_branch_code = @branch
and (
1 = 1 ${dateCondition} or
1 = 1 ${dateCondition_ly}
)
group by b.[CITY_BRANCH_CODE], b.[CITY_BRANCH_ALIAS]
${havingSum}
order by b.[CITY_BRANCH_CODE], b.[CITY_BRANCH_ALIAS]`
		dataObj.sql_str = str;//select语句
		var term_info = [];
		if(true){
			var len0 = term_info.length;
			term_info[len0] = {};
			term_info[len0].name = 'p'+len0;
			term_info[len0].type = '1';
			term_info[len0].title = '机构';
			term_info[len0].default = this.state.branchCode;
			term_info[len0].optional = '';
			term_info[len0].param_str = '@branch';
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
		if(true){
			var len1 = term_info.length;
			term_info[len1] = {};	
			term_info[len1].name = 'p'+len1;
			term_info[len1].type = '4';
			term_info[len1].title = this.state.nextDate ? '开始日期':"日期"
			term_info[len1].default = this.state.dateTime+'';
			term_info[len1].optional = this.state.dateType === 'year'?1: this.state.dateType==='month'?2:3;
			term_info[len1].param_str = '@begin_date';
		}	
		if(this.state.nextDate){
			var len1 = term_info.length;
			term_info[len1] = {};	
			term_info[len1].name = 'p'+len1;
			term_info[len1].type = '4';
			term_info[len1].title = '结束日期';
			term_info[len1].default = this.state.dateTime1+'';
			term_info[len1].optional = this.state.dateType === 'year'?1: this.state.dateType==='month'?2:3;
			term_info[len1].param_str = '@end_date';
		}
		dataObj.term_info = term_info;
		this.setState({
			data:dataObj.term_info
		})
		this.props.commonStore.setCode(dataObj)
		console.log(JSON.stringify(dataObj))
	}
	getValue(id){
		for(var j =0;j<this.state.idc.length;j++){
			if(this.state.idc[j].idc_id === id){
				return this.state.idc[j].idc_name
			}
		}
	}
  	render() {
    	return (
		 	<Row>
			   <Col span={22}>
				<Card bordered={true} style={{margin:'10px'}} title='参数设置'>
					<div>
						<div className='defaultTitle'>
							<Switch disabled defaultChecked />
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
								<div ref='year'  style={{display:'none'}}>
									<Select defaultValue="0" style={{ width: 100 }} onChange={e=>{
											this.setState({
												dateTime:e
											})}}>
									  <Option value="0">今年</Option>
									  <Option value="1">去年</Option>
									</Select>
								</div>
								<div ref='month'  style={{display:'none'}} >
									<Select defaultValue="0" style={{ width: 100 }} onChange={e=>this.setState({
										dateTime:e
									})}>
									  <Option value="0">本月</Option>
									  <Option value="1">上月</Option>

									</Select>
								</div>
								<div  ref='day'>
									<Select defaultValue="0" style={{ width: 100 }} onChange={e=>this.setState({
										dateTime:e
									})}>
									  <Option value="0">年初</Option>
									  <Option value="1">年末</Option>
									  <Option value="2">月初</Option>
									  <Option value="3">月末</Option>
									  <Option value="4">当日</Option>
									</Select>
								</div>
							</div>
						</div>
						<div className='default'>
							<div>参数名称：</div>
							<Input placeholder='参数名称'
								value='@begin_date'
								disabled
								onChange={e=>this.setState({ dateTxt: e.target.value.replace(/^\s\s*/, '')})}
								 style={{width:'120px'}} />
						</div>
				  </div>
				  	{
						this.state.nextDate && 
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
									(<Select  value={this.state.dateTime1}style={{ width: 100 }} onChange={e=>this.setState({
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
									  <Option value="2">月初</Option>
									  <Option value="3">月末</Option>
									  <Option value="4">当日</Option>
									</Select>)
								}
							</div>
						</div>
						<div className='default'>
							<div>参数名称：</div>
							<Input placeholder='参数名称'
								value='@end_date'
								disabled
								onChange={e=>this.setState({ dateTxt: e.target.value.replace(/^\s\s*/, '')})}
								 style={{width:'120px'}} />
						</div>
				  </div>)
					}
					<div>
						<div className='defaultTitle'>
							<Switch disabled defaultChecked />
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
						 	expandTrigger='hover'
							defaultValue={['610000', '610000', '610000']} 
							 placeholder="Please select" style={{width: 240}}/>
						</div>
						<div  className='default'>
							<div>参数名称：</div>
							<Input placeholder='参数名称'
							 	value='@branch'
								disabled
                             onChange={e=>this.setState({ branchTxt: e.target.value})}
							 style={{width:'100px'}} />
						</div>
					</div>
				 
				</Card>
			   </Col>  
			   <Col span={22}>
				<Card bordered={true} style={{margin:'10px'}} title='指标选择'>
					 <Transfer
						dataSource={this.state.idc}
						showSearch
						listStyle={{
						  width: 224,
						  height: 300,
						}}
						targetKeys={this.state.targetKeys}
						operations={['确认', '取消']}
						onChange={this.handleChangeX}
						render={item => `${item.idc_name}`}
						footer={this.renderFooter}
						rowKey={record => record.idc_id}
					  />
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
							value={this.state.tableArrData}
							onChange={(e)=>this.handleChangeTable(e)}
						  >
							<Option key='保费'>保费</Option>
							<Option key='机构号'>机构号</Option>
							<Option key='机构'>机构</Option>
						  </Select>
					</div>
						{this.state.tableArr.map((e,index)=>{
						return (<div key={index}  style={{marginTop:'8px'}}>
							<div style={{marginLeft:'30px'}}>输入{(<span style={{fontWeight:'bold',color:'#000'}}>{e.columns}</span>)}的二级表头：
						 <Select
							mode="tags"
							style={{ width: '50%' }}
							placeholder="请输入子表头"
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
				  <p style={{textAlign:'center'}}><Button type="primary" onClick={()=>this.pushData()}>预览</Button></p>
			  </Col>
			</Row>
    );
  }
}



