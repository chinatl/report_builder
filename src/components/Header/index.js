import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('userStore', 'commonStore')
@observer
class Header extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-light" style={{borderBottom:'2px solid #1890ff'}}>
        <div className="container">
          <div className="navbar-brand">
			<span style={{color:'#1890ff'}}>
         		报表制作工具
			</span>
          </div>
            <ul className="nav navbar-nav pull-xs-right">
				<li className="nav-item">
				  <Link to="/editor" className="nav-link"  style={{color:'#000'}}>
					创建
				  </Link>
				</li>
			  </ul>
        </div>
      </nav>
    );
  }
}

export default Header;
