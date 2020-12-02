import React, { Component, Fragment } from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';
import PuzzlePage from '../../../components/puzzle-page';
import { getPuzzleInput } from '../../../utils/utils';
import './index.css';

/* Puzzle Solution */

function isValid1(password) {
  let count = password.password.split('').filter(c => c === password.letter).length;
  return count >= password.range[0] && count <= password.range[1];
}

function isValid2(password) {
  let a = (password.password[password.range[0] - 1] === password.letter),
      b = (password.password[password.range[1] - 1] === password.letter);

  // JS doesn't have a boolean XOR, but as long as both arguments are of the set
  // `[0, 1, true, false]`, bitwise XOR works as expected.
  //
  // A reasonable replacement would be `a !== b`.
  return a ^ b;
}

function* solve(passwords, filter) {
  let count = 0;
  for (let i = 0; i < passwords.length; i++) {
    let valid = filter(passwords[i]);
    if (valid) count++;
    yield { password: passwords[i], valid, checked: i + 1, found: count };
  }
  return { found: count };
}

/* Puzzle Visuals */

const FRAME_RATE = 1000 / 60;

class Puzzle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      passwords: [],
      search1: [],
      search2: [],
      frame: 0
    };
  }

  componentDidMount() {
    this.run();
  }

  render() {
    let progress = this.state.checked ?
      `[${String(this.state.checked).padStart(5, '0')}/${String(this.passwords.length).padStart(5, '0')}]` :
      '';

    return (
      <div className="puzzle-2020-02">
        <Flipper flipKey={[this.state.part1, this.state.part2].join(',')} stagger spring="gentle">
          {this.state.part1 &&
          <Flipped flipId="part1">
            <div className="solution part1">
              <h4>Part 1:</h4>
              <pre>{this.state.part1}</pre>
            </div>
          </Flipped>}
          {this.state.part2 &&
          <Flipped flipId="part2">
            <div className="solution part2">
              <h4>Part 2:</h4>
              <pre>{this.state.part2}</pre>
            </div>
          </Flipped>}
          <Flipped flipId="terminal">
            <div class="password-terminal">
              <pre>&gt; TOBOGGAN         {progress}<br />
              {this.state.password && <Fragment>
              RULE:     {this.state.password.range.join('-')} {this.state.password.letter}<br />
              PASSWORD: {this.state.password.password}_</Fragment>}
              {!this.state.password && <fragment>
              <br />
              SCAN COMPLETE_
              </fragment>}
              <br />
              <br />
              <br />
              </pre>
            </div>
          </Flipped>
        </Flipper>
      </div>
    )
  }

  async run() {
    let input = await getPuzzleInput('input.txt');
    this.passwords = input.map(s => s.match(/(\d+)-(\d+) (.): (.+)/)).map(a => ({
      range: [parseInt(a[1], 10), parseInt(a[2], 10)],
      letter: a[3],
      password: a[4]
    }));
    this.frame = 0;
    this.solvePart1 = solve(this.passwords, isValid1);
    window.requestAnimationFrame(t => this.update(t));
  }

  async update(t) {
    if (t - this.lastTime < FRAME_RATE) {
      return window.requestAnimationFrame(t => this.update(t));
    }
    this.lastTime = t;

    if (this.solvePart1) {
      // Solving Part 1
      let next = this.solvePart1.next();
      if (next.done) {
        this.solvePart1 = undefined;
        this.solvePart2 = solve(this.passwords, isValid2);
        this.setState({ password: undefined, valid: undefined, checked: undefined, found: undefined, part1: next.value.found });
      } else {
        this.setState(next.value);
      }
    } else if (this.solvePart2) {
      // Solving Part 2
      let next = this.solvePart2.next();
      if (next.done) {
        this.solvePart2 = undefined;
        this.setState({ password: undefined, valid: undefined, checked: undefined, found: undefined, part2: next.value.found });
      } else {
        this.setState(next.value);
      }
    }

    this.frame++;

    // This puzzle gets an artificial speed up, by running multiple times each frame.
    if (Math.random() < 0.7) {
      this.lastTime = 0;
      this.update(t);
    } else {
      window.requestAnimationFrame(t => this.update(t));
    }
  }
}

export default function Page() {
  return <PuzzlePage year="2020" day="2" title="Password Philosophy">
    <Puzzle />
  </PuzzlePage>;
}
