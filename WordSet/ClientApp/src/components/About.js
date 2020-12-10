import React, { Component } from 'react';

export class About extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>About Word List Calculator</h1>
        <p>This site provides utilies of word list.</p>
        <h2>Contact</h2>
        <p><a href="https://twitter.com/intent/tweet?screen_name=hanlray&ref_src=twsrc%5Etfw" class="twitter-mention-button" data-show-count="false">Tweet to @hanlray</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></p>
      </div>
    );
  }
}
