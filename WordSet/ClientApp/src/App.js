import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { About } from './components/About';

import './custom.less'
import { Home } from './components/Home';

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
        <Layout>
            <Route exact path='/' component={Home} />
        <Route path='/about' component={About} />
      </Layout>
    );
  }
}
