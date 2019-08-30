import React, { Component } from 'react';
import { Spin } from 'antd';

class Loading extends Component {
  render() {
    return (
      <div>
        <Spin />
      </div>
    );
  }
}

export default Loading;
