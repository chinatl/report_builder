import React from 'react';
import { Row, Col,Table,Input,Card,Checkbox,Button,Select ,Cascader,DatePicker,Breadcrumb,Alert,Spin,message} from 'antd';
import moment from 'moment';
import Branch from './branch.json'
import Province from './Province.json'
import City from './City1.json'
import _superagent from 'superagent';
import Style from './styles.css'
const { MonthPicker } = DatePicker;
const { Column, ColumnGroup } = Table;
const dateFormat = 'YYYYMMDD';
const { TextArea } = Input;
const Option = Select.Option;
const nowYear = moment().format('YYYY');
const lastYear = moment().add(-1,'year').format('YYYY');
var maxNum = 0;
var Num = 0;
var flagBranch = '';
//const URL = '/api/report-builder/';
 const URL = '/';
class Home extends React.Component {
	state = {
        data:{
			columns:[],
			report:[],
			term_info:[],
			is_total:0,
			remark:"",
			branch_level:'',
			branch_level_down:'',
			title:'',
			last_update_time:""
		},
        param:{
            
        },
		code: null,
	  	location:[{
			label: '省公司',
			value: '610000'
		}],
		loading:false,
	}
    componentWillMount() {
//		var data = {
//			"last_update_time":"2018-01-11 09:53:57",
//			"is_total":"1",
//			"columns":[{"columns": "机构号"},{"columns": "机构"},{"columns": "个险三年期交"},{"columns": "个险十年期交"},{"columns": "个险首年期交"}],
//			"report":[{"d4":579.04,"d5":18353.55,"d1":"610100","d2":"陕西西安分公司","d3":13140.55},{"d4":6.87,"d5":610.71,"d1":"610200","d2":"陕西铜川分公司","d3":545.84},{"d4":58.86,"d5":3637.51,"d1":"610300","d2":"陕西宝鸡分公司","d3":2346.62},{"d4":89.51,"d5":9789.09,"d1":"610400","d2":"陕西咸阳分公司","d3":9315.04},{"d4":60.87,"d5":6061.02,"d1":"610500","d2":"陕西渭南分公司","d3":5670.88},{"d4":59.75,"d5":1925.44,"d1":"610600","d2":"陕西汉中分公司","d3":1609.55},{"d4":79.11,"d5":1009.80,"d1":"610700","d2":"陕西延安分公司","d3":489.77},{"d4":203.84,"d5":3280.13,"d1":"612100","d2":"陕西安康分公司","d3":1806.04},{"d4":27.88,"d5":2666.49,"d1":"612200","d2":"陕西商洛分公司","d3":2355.14},{"d4":251.87,"d5":7534.74,"d1":"612300","d2":"陕西榆林分公司","d3":6737.66}],
//			"branch_level":"P",
//			"term_info":[{"name":"p0","type":"1","title":"机构","default":"[610000, 610000, 610000]","optional":"","param_str":"@branch"},{"name":"p1","type":"4","title":"开始日期","default":"20180101","optional":3,"param_str":"@begin_date"},{"name":"p2","type":"4","title":"结束日期","default":"20180101","optional":3,"param_str":"@end_date"}],
//			"remark":"1、数据从 cbps8 健康险 系统抽取；\n2、该报表数据每10分钟更新一次；更新一次；",
//			"branch_level_down":"C",
//			"title":"各渠道当日录单快报 "}
//		this.setState({
//			data:data
//		})
		var code = this.props.code;
		if(code!== undefined && code != 0 && code != ''){
			this.setState({
				loading:true
			})
			this.setState({
				code:code
			})
			_superagent
			.post(URL+''+code+'/table')
			.set("Content-Type", "application/json")
			.send('{}')
		  	.then(res=>{
				if(res.body.code == 0){
					var data = res.body.data;
					var obj = {};
					obj.columns  = JSON.parse(data.columns);
					obj.term_info  = data.term_info;
					obj.report  = data.report;
					obj.branch_level  = data.branch_level;
					obj.branch_level_down  = data.branch_level_down;
					obj.is_total  = data.is_total;
					obj.last_update_time  = data.last_update_time;
					obj.title  = data.title;
					obj.remark  = data.remark;
					this.setState({
						data:obj
					})
					this.setState({
						loading:false
					})
				}else {
					alert(res.body.msg)
					this.setState({
						loading:false
					})
				}
			})
			.catch(err=>{
				alert('系统错误')
				this.setState({
					loading:false
				})
			})
		}
	}
    componentWillReceiveProps(e) {
		if(e.code !== this.state.code){
			this.setState({
				code:e.code
			})
			this.setState({
				loading:true
			})
			this.setState({
				 data:{
					columns:[],
					report:[],
					term_info:[]
				}
			})
			_superagent
			.post(URL+''+e.code+'/table')
			.set("Content-Type", "application/json")
			.send('{}')
		  	.then(res=>{
				if(res.body.code == 0){
					var data = res.body.data;
					var obj = {};
					obj.columns  = JSON.parse(data.columns);
					obj.term_info  = data.term_info;
					obj.report  = data.report;
					obj.branch_level  = data.branch_level;
					obj.branch_level_down  = data.branch_level_down;
					obj.is_total  = data.is_total;
					obj.last_update_time  = data.last_update_time;
					obj.title  = data.title;
					obj.remark  = data.remark;
					this.setState({
						data:obj
					})
					this.setState({
					  	location:[{
							label: '省公司',
							value: '610000'
						}]
					})
					this.setState({
						loading:false
					})
				}else {
					alert(res.body.msg)
					this.setState({
						loading:false
					})
				}
			}).catch(err=>{
				alert('系统错误')
				this.setState({
					loading:false
				})
			})
		}
    }
    changePage(){
		this.setState({
			loading:true
		})
		_superagent
			.post(URL+''+this.state.code+'/table')
			.set("Content-Type", "application/json")
			.send(JSON.stringify(this.state.param))
		  	.then(res=>{
				if(res.body.code == 0){
					var data = res.body.data;
					var obj = {};
					obj.columns  = JSON.parse(data.columns);
					obj.term_info  = data.term_info;
					obj.report  = data.report;
					obj.branch_level  = data.branch_level;
					obj.branch_level_down  = data.branch_level_down;
					obj.is_total  = data.is_total;
					obj.last_update_time  = data.last_update_time;
					obj.title  = data.title;
					obj.remark  = data.remark;
					this.setState({
						data:obj
					})
					this.setState({
						loading:false
					})
				}else {
					alert(res.body.msg);
					this.setState({
						loading:false
					})
				}
			}).catch(err=>{
				alert('系统错误')
				this.setState({
					loading:false
				})
			})
		}
  	render() {
		var data1 = this.state.data.report;
		var headLength = this.state.data.columns.length;
		var conLen = data1.length;
		var columns = this.state.data.columns;
		var len = 0;
		for(var i =0 ;i<columns.length;i++){
			if(columns[i].children){
				for(var j = 0;j<columns[i].children.length;j++){
					len ++;
				}
			}else {
				len ++
			}
		}
		if(data1){
			maxNum = 0;
			var x = data1[0] || {};
			for(var k in x){
				maxNum ++
			}
		}
		var classTitle = this.state.data.is_total === '0' ? '' : 'table';
		if(len && maxNum){
			if(len !== maxNum){
				message.warning('表头和内容数量不一致')
			}
		}
		var leveldown ;
		if(this.state.data.branch_level_down === this.state.data.branch_level){
			leveldown = '';
		}else {
			leveldown = 'leveldown';
		}	
		if(this.state.data.branch_level_down==='N'){
			leveldown = '';
		}
		Num = 0;
		var Screenwidth ;
		if(window.screen.availWidth < 640){
			Screenwidth = '100%'
		}else {
			Screenwidth =110*maxNum + 'px'
//			if(120*maxNum > 640){
//				Screenwidth =120*maxNum + 'px'
//			}else {
//				Screenwidth = '100%'
//			}
		}
		if(this.state.data.report.length==0){
			Screenwidth ='100%'
		}
    return (
      <div style={{padding:'20px',paddingBottom:'0',position:'relative',margin:'0 auto',width:Screenwidth}}
       className='report'>
      <Spin spinning={this.state.loading} size="large" tip="加载中...">
      		<h3 style={{textAlign:"center",height:'30px',margin:'20px'}}>{this.state.data.title}</h3>
		  {this.state.data.term_info && this.state.data.term_info.map((value,index)=>{
			  if(value.type == '4'){
				if(value.optional == '1'){
					return (
						<span key={index} style={{margin:'0px 10px 10px 0',display:'inline-block'}}>
						<span style={{display:'block',marginRight:'10px'}}>
						<span className='mr10'>{value.title}</span>
						<Select 
					   		defaultValue={value.default+''}
					   		onChange={e=>{
								var obj = this.state.param;
                                obj[value.name] = e;
                                this.setState({
                                    param:obj
                                })
                                this.changePage()
							}}
					   		 style={{ width: 120 }}>
						   <Option value={nowYear + ''}>{nowYear+'年'}</Option>
						   <Option value={lastYear + ''}>{lastYear+'年'}</Option>
						</Select></span></span>)
				}else if(value.optional == '2'){
					return (
					  	<span key={index} style={{margin:'0px 10px 10px 0',display:'inline-block'}}>
						<span style={{display:'block'}}>
						<span className='mr10'>{value.title}</span>
						<MonthPicker placeholder="Select Month"
							onChange={(e,time)=>{
								var obj = this.state.param;
                                obj[value.name] = time;
                                this.setState({
                                    param:obj
                                })
                                this.changePage()
							}}
							format='YYYYMM'
						  	defaultValue={
								moment(value.default, 'YYYYMM')
								}/>
					 </span></span>)
				}else if(value.optional == '3'){
					return (
					   <span key={index} style={{margin:'0px 10px 10px 0',display:'inline-block'}}>
						<span style={{display:'block',marginRight:'10px'}}>
						<span className='mr10'>{value.title}</span>
						<DatePicker  placeholder="Select Month"
							onChange={(e,time)=>{
								var obj = this.state.param;
                                obj[value.name] = time;
                                this.setState({
                                    param:obj
                                })
                                this.changePage()
							}}
							format='YYYYMMDD'
						 defaultValue={
						moment(value.default, 'YYYYMMDD')
						}/>
					 </span></span>
					)
				}  
			  }else if(value.type == '2'){
				  return (
					  <div key={index} className='moreline'>
						<span className='mr10'>{value.title}</span>
						<Select
						 defaultValue={value.default} 
						 onChange={e=>{
                            if(e){
                                var obj = this.state.param;
                                obj[value.name] = e;
                                this.setState({
                                    param:obj
                                })
                                this.changePage()
                            }
                        }}
						style={{ width: 120 }}>
							{
							  value.optional.split(' ').map((e,i)=>{
								  return <Option value={e.split('-')[0]} key={i}>{e.split('-')[1]}</Option>
							  })
						  }
						</Select>
					  </div>   
				)
			  }else if(value.type == '3'){
				
				  var newArr = [];
				  if(!value.optional){
					  return null
				  }
				  var arrs =value.optional.split(' ');
				  for(var i= 0;i<arrs.length;i++ ){
					  	var nullStr = arrs[i].split('-')[0];
						newArr.push(nullStr)
				  }
				  return (
					  <div key={index} className='moreline'>
						<span className='mr10'>{value.title}</span>
						<Select
						mode="multiple"
						style={{ width: '70%' }}
						placeholder="请选择"
						defaultValue={newArr}
						onChange={e=>{
                            if(e.length!==0){
                                var obj = this.state.param;
                                obj[value.name] = e.join(',');
                                this.setState({
                                    param:obj
                                })
                                this.changePage()
                            }
                        }}
					  >
							{
							  value.optional.split(' ').map((e,i)=>{
								  return <Option value={e.split('-')[0]} key={i}>{e.split('-')[1]}</Option>
							  })
						  }
						</Select>
					  </div> 
				)
                }else if(value.type == '1'){
                    var obj = this.state.param;
					var arr = JSON.parse(value.default);
					var newArr = [];
					newArr.push(arr[1] + '')
					flagBranch = value.name;
                    return (
                        <div key={index} className='moreline'>
                        <span className='mr10'>{value.title}</span>
                        <Cascader options={
								this.state.data.branch_level_down === 'C'?City :Province
							} 
                            value = {newArr}
                            placeholder="Please select"
                            expandTrigger='hover'
                            disabled = {this.state.data.branch_level_down !== 'C'}
                            style={{width: '141'}}
                            onChange={(e,i)=>{
                            if(true){
							 	var obj = this.state.param;
                                obj[value.name] = ["610000",...e,...e];
                                this.setState({
                                    param:obj
                                })
								console.log(obj)
								if(e[0]=== '610000'){
									this.setState({
										location:[{
											label: '省公司',
											value: '610000'
										}]
									})
								}else {
									var locationData = this.state.location;
									locationData[1] = i[0];
									this.setState({
										location:locationData
									})
									console.log(locationData)
								}
                                this.changePage()
                            }
                        }}
                        />
                      </div>)
             }
			})
		  }
                <Button 
                	className='button'
                	type="primary" icon="reload" 
              		 loading={this.props.iconLoading} onClick={()=>{
               		 this.changePage()
                  }}>
                  刷新
                </Button>
			{this.state.data.last_update_time && <p style={{margin:'0 0 10px 0',textAlign:'right'}}>更新时间({this.state.data.last_update_time})</p>}
            { data1.length>0  && <Alert style={{ marginBottom: '10px'}}  message={
            <Breadcrumb style={{cursor:'pointer'}}>
            {
              this.state.location && this.state.location.map((l,index)=>
                <Breadcrumb.Item key={index} onClick={()=>{
                  const location = [];
                  for(let loc of this.state.location){
                    location.push(loc);
                    if (l.value === loc.value) {
                      break;
                    }
                  }
					this.setState({
					  location
					});
				  	var obj = this.state.param;
					obj[flagBranch] = ["610000",l.value+'',l.value+''];
					this.setState({
						param:obj
					})
					 this.changePage()
				 }
         
                }>
                  <span>{l.label}</span>
                </Breadcrumb.Item>
              )
            }
            </Breadcrumb>

          } />}
	  <div className={classTitle} >
		  { data1.length>0 && <Table
		 	className={leveldown}
			dataSource={data1}
			pagination={false}
			size="small"
			bordered
			rowKey='d1'
			scroll={{x:90*(maxNum)}}
		 	onRowClick={(record, index,e)=>{
			if(!e.target.children[0]){
				return
			}
		  	if(this.state.data.is_total === '1' && index === 0){
				return 
			}
			if(this.state.data.branch_level_down === 'N'){
				return
			}
			if(this.state.data.branch_level != this.state.data.branch_level_down && this.state.data.branch_level_down ){
					 this.setState({
						location: [...this.state.location,{label: record.d2,value: record.d1}]
					  });
					 var obj = this.state.param;
					obj[flagBranch] = ["610000",record.d1+'',record.d1+''];
					this.setState({
						param:obj
					})
					this.changePage()
				}
              }}
		 >
			{  
			 this.state.data.columns &&
			this.state.data.columns.map(function(v,index){  
				 
				if(typeof v === 'string'){
					if(index===0){
						return null
					}else {
						return 	(<Column
							  title={v}
							  dataIndex={'d'+(index+1)}
							  key={Math.random()}
							/>)
					}

				}else {
				if(v.children !== undefined){
					let title = v.columns;
					return (
						<ColumnGroup title={title} key={Math.random()+''}>
						{
						v.children.map(function(value,index){
							Num++
							if(Num==maxNum+1){
								Num = 1;
							}
							return <Column
								  title={value}
								  dataIndex={'d'+Num}
								  key={Math.random()+''}
								/>
						})}
						</ColumnGroup>)
				}else {
					Num++;
					if(Num==maxNum+1){
						Num = 1;
					}
					if(Num == 1){
						return null
					}
					return 	(<Column
						  title={v.columns}
						  dataIndex={'d'+Num}
						  key={Math.random()}
						/>)

				}
				}
			})
			}
			</Table>}
			<div style={{marginTop:'20px',color:'#000'}}>
				{this.state.data.remark && <p style={{margin:'20px 0 0 0',color:'#000'}}>备注：</p>}
				{this.state.data.remark && this.state.data.remark.split('\n').map(e=>{
					return (<p style={{margin:0}} key={Math.random()}>{e}</p>)
				})}
			</div>
	  	</div>
		</Spin>
      </div>
    );
  }
}
export default Home;



