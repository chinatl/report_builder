import React from 'react';
import ReactDOM from 'react-dom';
import promiseFinally from 'promise.prototype.finally';
import { HashRouter } from 'react-router-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import registerServiceWorker from './registerServiceWorker';


import './index.css';
import './assets/css/font.css';
import './assets/css/main.css';
import App from './App';

import commonStore from './stores/commonStore';
import userStore from './stores/userStore';
import authStore from './stores/authStore';


import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

const stores = {
	commonStore,
	userStore,
	authStore
};

promiseFinally.shim();
useStrict(true);

ReactDOM.render((
  <Provider {...stores}>
    <HashRouter>
      <LocaleProvider locale={zh_CN}><App /></LocaleProvider>
    </HashRouter>
  </Provider>
), document.getElementById('root'));
registerServiceWorker();
