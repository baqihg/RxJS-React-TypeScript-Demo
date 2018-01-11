import React, { PureComponent } from 'react';
import './circle.scss';


export interface CircleProps {
  className?: string;
  left: number;
  top: number;
  color: string;
  radius: number;
}

export default class Circle extends PureComponent<CircleProps, {}>{
  render() {
    const { left, top, color: backgroundColor, className } = this.props;
    let { radius } = this.props;
    let diff = (100 - radius) / 20;
    radius /= 10;
    return (
      <div className={`circle ${className || ''}`} style={{
        left: left + diff,
        top: top + diff,
        backgroundColor,
        height: radius,
        width: radius
      }}>
      </div>
    );
  }
}