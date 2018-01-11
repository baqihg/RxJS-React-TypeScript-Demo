import React, { PureComponent } from 'react';
import CircleComponent from '../components/circle';
import './diffuse.scss';

const Fragment = React.Fragment;

export interface circleProps {
  offset: {
    left: number;
    top: number;
  },
  color: string;
}

export default class Circle extends PureComponent<circleProps, {}>{
  render() {
    const { offset, color: backgroundColor } = this.props;
    const transform = new Array(12).fill(undefined);
    return (
      transform.map((value, index) => {
        {/*外层包括一层div，在外层div上做旋转，可以避免进行三角函数的计算*/ }
        return <div key={index} className={`container_${index + 1}`} style={{ ...offset }}>
          <CircleComponent className="diffuse_circle" offset={{ top: 0, left: 0 }} color={backgroundColor} />
        </div>
      })
    );
  }
}