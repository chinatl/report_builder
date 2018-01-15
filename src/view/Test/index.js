// import ArticleList from './ArticleList';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, NavLink } from 'react-router-dom'
import Common from './../../components/Common'
import Head from './../../components/Header'
export default class Editor extends React.Component {
	state = {
		code:0
	}
  componentWillMount() {
    // this.props.articlesStore.setPredicate(this.getPredicate());
	  if(this.props.location.search){
		  console.log(this.props.location)
		  var x = this.props.location.search.slice(1);
		  var code = x.split('=')[1];
		  this.setState({
			  code:code
		  })
	  }
  }

  componentDidMount() {
    // this.props.articlesStore.loadArticles();
  }

  componentDidUpdate(previousProps) {
  
  }

  render() {
    return (
     	<div>
		 	<Common code={this.state.code}/>
     	</div>	
    );
  }
};
