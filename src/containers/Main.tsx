import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import Rx from 'rxjs';
import CircleComponent from '../components/circle';
import DiffuseComponent from '../components/diffuse';
import './Main.scss';

interface Position {
  top: number;
  left: number;
  time: number;
  radius: number;
  color?: number;
}

interface MainState {
  moveCircleList: Position[];
  color: number;
  lastPosition: Position;
  downDiffuseList: Position[];
  isDown: boolean;
}

export default class Main extends PureComponent<{}, MainState>{
  state = {
    moveCircleList: [], //移动时，DOM节点所在的数组
    color: 16777215, //使用十进制进行计算，传入时转换为16进制
    lastPosition: null,
    downDiffuseList: [], //按下时，DOM节点所在的数组
    isDown: false,
  }

  private mainDOM;

  //过滤半径为0的圆
  filterList = () => {
    let filterSubject = new Rx.Subject();

    filterSubject.subscribe(() => {
      Rx.Observable.from(this.state.moveCircleList)
        .map(value => { value.radius -= 2; return value; })
        .filter(value => value.radius > 0)
        .reduce((arr, value) => [...arr, value], [])
        .subscribe(moveCircleList => this.setState({ moveCircleList }))
    });

    filterSubject.subscribe(() => {
      Rx.Observable.from(this.state.downDiffuseList)
        .map(value => { value.radius -= 2; return value; })
        .filter(value => value.radius > 0)
        .reduce((arr, value) => [...arr, value], [])
        .subscribe(downDiffuseList => this.setState({ downDiffuseList }))
    });

    Rx.Observable.interval(16).subscribe(filterSubject);
  }
  //根据时间改变颜色
  changeColor = (intervalSubject) => {
    intervalSubject.subscribe(() => {
      Rx.Observable.of(this.state.color).subscribe((color) => {
        this.setState({
          color: color < 597 ? 16777215 : color - 597
        });
      });
    });
  }
  //根据最后的位置来生成圆
  generateCircleByLastPosition = (intervalSubject) => {
    const stream = intervalSubject
      .flatMap(() => Rx.Observable.of(this.state))
      .filter(({ lastPosition }) => !!lastPosition);

    stream.filter(({ isDown }) => isDown)
      .subscribe(({ lastPosition, downDiffuseList, color }) => {
        this.setState({
          downDiffuseList: [...downDiffuseList, { ...lastPosition, color, time: Date.now() }]
        });
      });

    stream.filter(({ isDown }) => !isDown)
      .subscribe(({ lastPosition, moveCircleList, color }) => {
        this.setState({
          moveCircleList: [...moveCircleList, { ...lastPosition, color, time: Date.now() }]
        });
      });
  }

  mouseDown = (mainDOM: Element) => {
    const Observable = Rx.Observable.fromEvent(mainDOM, 'mousedown');
    Observable.subscribe((e: MouseEvent) => {
      Rx.Observable.of(this.state).subscribe(({ downDiffuseList, color }) => {
        const position = {
          top: e.pageY,
          left: e.pageX,
          radius: 100,
          time: Date.now(),
        }
        this.setState({
          downDiffuseList: [...downDiffuseList, { ...position, color }],
          lastPosition: position,
          isDown: true
        });
      });
    });
  }

  mouseUp = (mainDOM: Element) => {
    const Observable = Rx.Observable.fromEvent(mainDOM, 'mouseup');
    Observable.subscribe(() => {
      this.setState({
        isDown: false
      })
    });
  }

  mouseMove = (mainDOM: Element) => {
    const Observable = Rx.Observable.fromEvent(mainDOM, 'mousemove');
    Observable.subscribe((e: MouseEvent) => {
      Rx.Observable.of(this.state).subscribe(({ moveCircleList, color }) => {
        const position = {
          top: e.pageY,
          left: e.pageX,
          radius: 100,
          time: Date.now(),
        }
        this.setState({
          moveCircleList: [...moveCircleList, { ...position, color }],
          lastPosition: position
        });
      });
    });
  }

  componentDidMount() {
    const mainDOM = ReactDOM.findDOMNode(this.mainDOM);
    let intervalSubject = new Rx.Subject();

    this.changeColor(intervalSubject);
    this.generateCircleByLastPosition(intervalSubject);
    Rx.Observable.interval(30).subscribe(intervalSubject);

    this.filterList();

    this.mouseMove(mainDOM);
    this.mouseDown(mainDOM);
    this.mouseUp(mainDOM);
  }

  render() {
    const { moveCircleList, downDiffuseList } = this.state;
    return (
      <main className="main" ref={(mainDOM) => { this.mainDOM = mainDOM }}>
        {
          moveCircleList && moveCircleList.map((value, index) =>
            <CircleComponent key={value.time} {...value} color={`#${value.color.toString(16)}`} />
          )
        }
        {
          downDiffuseList && downDiffuseList.map((value, index) =>
            <DiffuseComponent key={value.time} {...value} color={`#${value.color.toString(16)}`} />
          )
        }
      </main>
    );
  }
}