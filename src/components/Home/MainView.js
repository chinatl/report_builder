// import ArticleList from './ArticleList';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, NavLink,Link } from 'react-router-dom'
import { parse as qsParse } from 'query-string';

export default class MainView extends React.Component {

  componentWillMount() {
    // this.props.articlesStore.setPredicate(this.getPredicate());
  }

  componentDidMount() {
    // this.props.articlesStore.loadArticles();
  }

  componentDidUpdate(previousProps) {
  
  }


  handleTabChange = (tab) => {
    if (this.props.location.query.tab === tab) return;
    this.props.router.push({ ...this.props.location, query: { tab } })
  };

  handleSetPage = page => {
    this.props.articlesStore.setPage(page);
    this.props.articlesStore.loadArticles();
  };

  render() {

    return (
      <div className="col-md-12">
        <div className="feed-toggle">
          <ul className="nav nav-pills outline-active">
           <li className="nav-item">Your Feed</li>
          </ul>
        </div>
       	<div style={{borderTop:'2px solid #5CB85C',width:'100%',marginTop:'10px'}}>
			<ul>
				<li>
				  <Link to={'/oldview'+'hello world'}> 
						<span>1</span><span>时间</span>
					</Link>
				</li>
			</ul>
       	</div>
      </div>
    );
  }
};
