import React, { PureComponent } from 'react';
import './circle.scss';


export interface circleProps {
  className?: string;
  offset: {
    left: number;
    top: number;
  },
  color: string;
}

export default class Circle extends PureComponent<circleProps, {}>{
  render() {
    const { offset, color: backgroundColor, className } = this.props;
    return (
      <div className={`circle ${className || ''}`} style={{ ...offset, backgroundColor }}>
      </div>
    );
  }
}