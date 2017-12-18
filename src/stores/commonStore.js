import { observable } from 'mobx';

class CommonStore {

  @observable appName = '报表生成器';
 
}

export default new CommonStore();