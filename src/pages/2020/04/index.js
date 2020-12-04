import React, { Component } from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PuzzlePage from '../../../components/puzzle-page';
import { getPuzzleInput } from '../../../utils/react';
import './index.css';

/* Puzzle Solution */

function valid1(passport) {
  let fields = [
      'byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'
  ];

  for (let field of fields) {
      if (!passport[field]) return false;
  }

  return true;
}

function int(x) {
  return parseInt(x, 10);
}

function valid2(passport) {
  if (!valid1(passport)) return false;

  if (int(passport.byr) < 1920 || int(passport.byr) > 2002) return false;
  if (int(passport.iyr) < 2010 || int(passport.iyr) > 2020) return false;
  if (int(passport.eyr) < 2020 || int(passport.eyr) > 2030) return false;
  let hgt = passport.hgt.match(/^(\d+)(cm|in)$/);
  if (!hgt) return false;
  if (hgt[2] === 'cm' && (int(hgt[1]) < 150 || int(hgt[1]) > 193)) return false;
  if (hgt[2] === 'in' && (int(hgt[1]) < 59 || int(hgt[1]) > 76)) return false;
  if (!passport.hcl.match(/^#[0-9a-f]{6}$/)) return false;
  if (!['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(passport.ecl)) return false;
  if (!passport.pid.match(/^\d{9}$/)) return false;

  return true;
}

/* Puzzle Visuals */

const FRAME_RATE = 1000 / 18;

class Puzzle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      values: [],
      passports: [],
      search1: [],
      search2: [],
      frame: 0
    };
  }

  componentDidMount() {
    this.run();
  }

  render() {
    const classFor = passport => {
      return valid2(passport) ? 'passport valid' : 'passport invalid';
    };

    return (
      <div className="puzzle-2020-04">
        {this.state.part1 &&
        <div className="solution part1">
          <h4>Part 1:</h4>
          <pre>{this.state.part1}</pre>
        </div>}
        {this.state.part2 &&
        <div className="solution part2">
          <h4>Part 2:</h4>
          <pre>{this.state.part2}</pre>
        </div>}
        <div className="passports">
          {this.state.passports.map((passport, index) =>
            <div key={passport.id} className={classFor(passport)}>
              <ul>
                <li><FontAwesomeIcon icon="flag" /> {passport.cid || 'XX'}</li>
                <li><FontAwesomeIcon icon="passport" /> {passport.pid || 'XX'}</li>
                <li><FontAwesomeIcon icon="hourglass-start" /> {passport.iyr || 'XX'}</li>
                <li><FontAwesomeIcon icon="hourglass-end" /> {passport.eyr || 'XX'}</li>
                <li><FontAwesomeIcon icon="birthday-cake" /> {passport.byr || 'XX'}</li>
                <li><FontAwesomeIcon icon="ruler-vertical" /> {passport.hgt || 'XX'}</li>
                <li><FontAwesomeIcon icon="hat-wizard" /> {passport.hcl || 'XX'}</li>
                <li><FontAwesomeIcon icon="eye" /> {passport.ecl || 'XX'}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }

  async run() {
    let input = await getPuzzleInput('input.txt');
    this.passports = input.join('\n').split('\n\n').map(entry => entry.replace(/\n/g, ' '));
    this.passports = this.passports.map(data =>
        Object.fromEntries(data.trim().split(/ +/).map(entry => entry.split(':')))
    );
    this.passports.forEach((passport, index) => passport.id = index);

    this.state.passports = [];
    this.frame = 0;
    this.view = 0;
    this.wait = 10;
    window.requestAnimationFrame(t => this.update(t));
  }

  async update(t) {
    if (t - this.lastTime < FRAME_RATE) {
      return window.requestAnimationFrame(t => this.update(t));
    }
    this.lastTime = t;

    if (this.wait > 0) {
      this.wait--;
    } else {
      this.view++;
    }

    this.setState({
      passports: this.passports.slice(Math.min(this.view, this.passports.length - 1), this.view + 3),
      part1: this.passports.slice(0, this.view).filter(valid1).length || undefined,
      part2: this.passports.slice(0, this.view).filter(valid2).length || undefined
    });

    window.requestAnimationFrame(t => this.update(t));
  }
}

export default function Page() {
  return <PuzzlePage year="2020" day="4">
    <Puzzle />
  </PuzzlePage>;
}
