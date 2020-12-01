import React, { Component } from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PuzzlePage from '../../../components/puzzle-page';
import { getPuzzleInput } from '../../../utils/utils';
import './index.css';

/* Puzzle Solution */

function* solvePart1(input) {
  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      let value = input[i] + input[j];
      if (value === 2020) return { search1: [i, j], part1: [i, j] };
      yield { search1: [i, j] };
      if (value > 2020) break;
    }
  }
}

function* solvePart2(input) {
  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      if (input[i] + input[j] > 2020) break;
      for (let k = j + 1; k < input.length; k++) {
        let value = input[i] + input[j] + input[k];
        if (value === 2020) return { search2: [i, j, k], part2: [i, j, k] };
        yield { search2: [i, j, k] };
        if (value > 2020) break;
      }
    }
  }
}

/* Puzzle Visuals */

const FRAME_RATE = 1000 / 60;

class Puzzle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      values: [],
      search1: [],
      search2: [],
      frame: 0
    };
  }

  componentDidMount() {
    this.run();
  }

  render() {
    const classFor = index => {
      if (this.state.search1.includes(index)) return 'search1';
      if (this.state.search2.includes(index)) return 'search2';
    };
    const matched = index => this.state.part1?.includes(index) || this.state.part2?.includes(index);

    return (
      <div className="puzzle-2020-01">
        <Flipper flipKey={this.state.values.concat(this.state.part1, this.state.part2).join(',')} stagger spring="gentle">
          {this.state.part1 &&
          <div className="solution part1">
            <h4>Part 1: <span className="search1">{this.state.part1.map(i => this.state.values[i]).join(' + ')} = 2020</span></h4>
            <pre>{this.state.part1.map(i => this.state.values[i]).reduce((a, b) => a * b)}</pre>
          </div>}
          {this.state.part2 && <div className="solution part2">
            <h4>Part 2: <span className="search2">{this.state.part2.map(i => this.state.values[i]).join(' + ')} = 2020</span></h4>
            <pre>{this.state.part2.map(i => this.state.values[i]).reduce((a, b) => a * b)}</pre>
          </div>}
          <ul>
            {this.state.values.map((value, index) =>
              <Flipped key={value} flipId={value}>
                <li className={classFor(index)}>{value}{matched(index) && <span><FontAwesomeIcon icon="check" /></span>}</li>
              </Flipped>
            )}
          </ul>
        </Flipper>
      </div>
    )
  }

  async run() {
    let input = await getPuzzleInput('input.txt');
    this.values = input.map(x => parseInt(x, 10));
    this.frame = 0;
    window.requestAnimationFrame(t => this.update(t));
  }

  async update(t) {
    if (t - this.lastTime < FRAME_RATE) {
      return window.requestAnimationFrame(t => this.update(t));
    }
    this.lastTime = t;

    if (this.frame < this.values.length) {
      // Animate loading the values onto the page
      this.state.values.push(this.values[this.frame]);
      //this.state.values= this.values;
      //this.frame = this.values.length;
      this.setState({ values: this.state.values });
    } else if (this.frame === this.values.length + 30) {
      // Sort list ascending, to prepare for solve
      this.state.values.sort((a, b) => a - b);
      this.setState({ values: this.state.values });
      this.solvePart1 = solvePart1(this.state.values);
    } else if (this.frame > this.values.length + 60 && this.solvePart1) {
      // Solving Part 1
      let next = this.solvePart1.next();
      this.setState(next.value);
      if (next.done) {
        this.solvePart1 = undefined;
        this.solvePart2 = solvePart2(this.state.values);
      }
    } else if (this.frame > this.values.length + 60 && this.solvePart2) {
      // Solving Part 2
      let next = this.solvePart2.next();
      this.setState(next.value);
      if (next.done) {
        this.solvePart2 = undefined;
      }
    }

    this.frame++;
    window.requestAnimationFrame(t => this.update(t));
  }
}

export default function Page() {
  return <PuzzlePage year="2020" day="1" title="Report Repair">
    <Puzzle />
  </PuzzlePage>;
}
