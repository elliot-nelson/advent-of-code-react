import React, { useEffect } from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './index.css';

/* Normal stuff */

async function getLines(file) {
  const data = await fetch(file).then(result => result.text());
  let lines = data.split('\n');
  if (lines[lines.length - 1] === '') lines.splice(-1);
  return lines;
}

/* Puzzle Solution */

const icons = [
  'database',
  'sd-card',
  'microchip',
  'memory',
  'ethernet',
  'satellite-dish',
  'rocket',
  'wrench'
];

function commas(number) {
  let result = String(number);
  if (result.length > 3) {
    result = `${result.slice(0, -3)},${result.slice(-3)}`;
  }
  return result;
}

function fuelRequired(mass) {
  return Math.floor(mass / 3) - 2;
}

function addFuel(gadget) {
  let fuel = fuelRequired(gadget.masses[gadget.masses.length - 1]);
  if (fuel > 0) {
    gadget.masses.push(fuel);
    gadget.totalFuelMass += fuel;
    return true;
  } else {
    return false;
  }
}

function addFuelToAll(gadgets) {
  return gadgets.reduce((added, gadget) => addFuel(gadget) || added, false);
}

/* Puzzle Visuals */

class Puzzle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gadgets: [],
      frame: 0
    };

    this.handleRunPuzzle = this.handleRunPuzzle.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.handleRunPuzzle();
  }

  render() {
    let items = this.state.gadgets.map(gadget =>
      <li key={gadget.id}>
        <span className="gadget-icon">
          <FontAwesomeIcon icon={gadget.icon} />
        </span>
        <span className="gadget-weight">
          <FontAwesomeIcon icon="weight-hanging" /> <b>{commas(gadget.masses[0])}</b>
          {gadget.masses.slice(1).map(mass => <span>
            <br /><FontAwesomeIcon icon="oil-can" /> {commas(mass)}
          </span>)}
        </span>
      </li>
    );
    return (
      <div className="puzzle-2019-01">
        <ul>
          {items}
        </ul>
        <div className="solution">
          <h4>Part 1 &nbsp; <FontAwesomeIcon icon="oil-can" /></h4>
          <pre className="part1">{this.state.part1 || '...'}</pre>
          <h4>Part 2 &nbsp; <FontAwesomeIcon icon="oil-can" /></h4>
          <pre className="part2">{this.state.part2 || '...'}</pre>
        </div>
      </div>
    )
  }

  async handleRunPuzzle() {
    const gadgets = (await getLines('input.txt')).map(line => parseInt(line, 10)).map((mass, idx) => ({
      id: `gadget-${idx}`,
      icon: icons[idx % icons.length],
      masses: [mass],
      totalFuelMass: 0,
      fuelDisplayed: 0
    }));
    this.setState({
      gadgets,
      frame: 0
    });
    setTimeout(this.update, 33);
  }

  /*async update() {
    if (this.state.finished) return;

    if (this.state.index < this.state.gadgets.length) {
      this.state.addedFuel = addFuel(this.state.gadgets[this.state.index]) || this.state.addedFuel;
      this.state.index++;
    } else {
      if (this.state.addedFuel) {
        this.state.index = 0;
        this.state.addedFuel = false;
      } else {
        this.state.finished = true;
        this.setState({
          part1: this.state.gadgets.reduce((sum, gadget) => {
            return sum + gadget.masses[1];
          }, 0),
          part2: this.state.gadgets.reduce((sum, gadget) => {
            return sum + gadget.masses.slice(1).reduce((sum, value) => sum + value, 0);
          }, 0)
        });
      }
    }

    this.setState({ gadgets: this.state.gadgets });
    setTimeout(this.update, 1);
  }*/
  async update() {
    if (this.state.finished) return;
    this.state.frame++;

    if (this.state.frame > 5) {
      let addedFuel = addFuelToAll(this.state.gadgets);
      if (!addedFuel) {
        this.state.finished = true;
        this.setState({
          part1: this.state.gadgets.reduce((sum, gadget) => {
            return sum + gadget.masses[1];
          }, 0),
          part2: this.state.gadgets.reduce((sum, gadget) => {
            return sum + gadget.masses.slice(1).reduce((sum, value) => sum + value, 0);
          }, 0)
        });
      }
    }

    this.setState({ gadgets: this.state.gadgets });
    setTimeout(this.update, 33);
  }
}

export default function Page() {
  return <div>
      <header>
        <FontAwesomeIcon icon="star" /> The Tyranny of the Rocket Equation <span>(2019 Day 1)</span>
      </header>
      <Puzzle />
    </div>
}


      //<!--<Link to="/2019/02/">Go to Day 2</Link>-->

        //<a href="#" onClick={this.handleRunPuzzle}>Run puzzleee</a>
