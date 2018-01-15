import { observable, action, reaction } from 'mobx';
import agent from '../agent';
import _superagent from 'superagent';
 const URL = ''
//const URL = '/api/report-builder'

class CommonStore {

	@observable appName = '报表生成器';
	@observable token = window.localStorage.getItem('jwt');
	@observable appLoaded = false;

	@observable tags = [];
	@observable isLoadingTags = false;
	@observable code;
  	constructor() {
    reaction(
      () => this.token,
      token => {
        if (token) {
          window.localStorage.setItem('jwt', token);
        } else {
          window.localStorage.removeItem('jwt');
        }
      }
    );
  }
 	@action.bound // 回调动作
    fetchProjectsSuccess(code) {
        this.code = code;
    }
   @action
   setCode(dataObj){
	   window.scrollTo(0,0);
		_superagent
			.post(URL+'/table')
			.set("Content-Type", "application/json")
			.send(JSON.stringify(dataObj))
		  .then(res=>{
			if(res.body.code===0){
			   this.fetchProjectsSuccess( res.body.data.id)
			}else {
				alert(res.body.msg)
			}
		}).catch(res=>{
			alert('系统错误')
		})
   }
  @action loadTags() {
    this.isLoadingTags = true;
    return agent.Tags.getAll()
      .then(action(({ tags }) => { this.tags = tags.map(t => t.toLowerCase()); }))
      .finally(action(() => { this.isLoadingTags = false; }))
  }

  @action setToken(token) {
    this.token = token;
	window.localStorage.setItem('pid', token.id);
  }

  @action setAppLoaded() {
    this.appLoaded = true;
  }

}
const self = new CommonStore();
export default new CommonStore();
