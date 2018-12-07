import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);
    console.log(props);
    const { cookies } = props;
    this.state = {
      quota: null,
      username: cookies.get('username') || 'Test'
    };
  }

  componentDidMount() {
    axios.get('/config.json')
      .then(res => {
        const config = res.data;
        config.clusters.forEach(cluster =>
          axios.get(cluster.endpoint + '/quota?user=' + this.state.username)
            .then(quotaResult => {
              this.setState({quota: {[cluster.name]: quotaResult.data}});
            })
        );
      });
  }

  render() {
    return (
      <div>
        {JSON.stringify(this.state.quota, undefined, 2)}
      </div>
    );
  }
}

export default withCookies(App);
