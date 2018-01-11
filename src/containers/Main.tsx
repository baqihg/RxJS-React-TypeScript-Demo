import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import Rx from 'rxjs';
import CircleComponent from '../components/circle';
import DiffuseComponent from '../components/diffuse';
import './Main.scss';
interface position {
  top: number;
  left: number;
  time?: number;
  color?: number;
}
interface mainState {
  moveCircleList: position[];
  color: number;
  lastPosition: position;
  downDiffuseList: position[];
  isDown: boolean;
}
export default class Main extends PureComponent<{}, mainState>{
  state = {
    moveCircleList: [], //移动时，DOM节点所在的数组
    color: 16777215, //使用十进制进行计算，传入时转换为16进制
    lastPosition: null,
    downDiffuseList: [],//按下时，DOM节点所在的数组
    isDown: false,
  }
  filterList = () => {
    //每隔一定时间，清除DOM节点
    Rx.Observable.interval(2000).subscribe(() => {
      Rx.Observable.from(this.state.moveCircleList)
        .filter(value => value.time + 2000 > Date.now())
        .reduce((arr, value) => [...arr, value], [])
        .subscribe(moveCircleList => { console.log(moveCircleList); this.setState({ moveCircleList }) });
    });
    Rx.Observable.interval(3000).subscribe(() => {
      Rx.Observable.from(this.state.downDiffuseList)
        .filter(value => value.time + 3000 > Date.now())
        .reduce((arr, value) => [...arr, value], [])
        .subscribe(downDiffuseList => this.setState({ downDiffuseList }));
    });
  }
  changeColor = () => {
    //颜色随时间进行变化
    Rx.Observable.interval(100)
      .subscribe(() => {
        Rx.Observable.of(this.state).subscribe((state: mainState) => {
          const valueInList = {
            ...state.lastPosition,
            time: Date.now(),
            color: state.color < 597 ? 16777215 : state.color - 597,
          };

          const lastPositionIf = Rx.Observable.if(() => !!state.lastPosition
            , Rx.Observable.of(state.isDown));

          lastPositionIf.subscribe((isDown: boolean) => {
            const isDownIf = Rx.Observable.if(() => isDown
              , Rx.Observable.from([...state.downDiffuseList, valueInList]));

            isDownIf
              .reduce((arr: position[], value) => [...arr, value], [])
              .subscribe((downDiffuseList: position[]) => {
                this.setState({
                  downDiffuseList,
                  color: valueInList.color
                })
              });

            const isDownElse = Rx.Observable.if(() => !isDown
              , Rx.Observable.from([...state.moveCircleList, valueInList]));

            isDownElse
              .reduce((arr: position[], value) => [...arr, value], [])
              .subscribe((moveCircleList: position[]) => {
                this.setState({
                  moveCircleList,
                  color: valueInList.color
                })
              });
          });
        });
      });
  }
  mouseDown = (mainDOM: Element) => {
    const Observable = Rx.Observable.fromEvent(mainDOM, 'mousedown');
    Observable.subscribe((e: MouseEvent) => {
      Rx.Observable.of(this.state).subscribe(({ downDiffuseList, color }) => {
        const time = Date.now();
        const position = {
          top: e.pageY,
          left: e.pageX,
        }
        this.setState({
          downDiffuseList: [...downDiffuseList, { ...position, time, color }],
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
        const time = Date.now();
        const position = {
          top: e.pageY,
          left: e.pageX,
        }
        this.setState({
          moveCircleList: [...moveCircleList, { ...position, time, color }],
          lastPosition: position
        });
      });
    });
  }
  componentDidMount() {
    const mainDOM = ReactDOM.findDOMNode(this.refs.main);
    this.filterList();
    this.mouseMove(mainDOM);
    this.changeColor();
    this.mouseDown(mainDOM);
    this.mouseUp(mainDOM);
  }
  render() {
    const { moveCircleList, downDiffuseList } = this.state;
    return (
      <main className="main" ref="main">
        {
          moveCircleList && moveCircleList.map((value, index) =>
            <CircleComponent key={value.time} offset={value} color={`#${value.color.toString(16)}`} />
          )
        }
        {
          downDiffuseList && downDiffuseList.map((value, index) =>
            <DiffuseComponent key={value.time} offset={value} color={`#${value.color.toString(16)}`} />
          )
        }
      </main>
    );
  }
}