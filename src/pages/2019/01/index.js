import React from 'react';
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

function fuelRequired(mass) {
  return Math.floor(mass / 3) - 2;
}

function addFuel(gadget) {
  console.log(['called:', gadget]);
  let fuel = fuelRequired(gadget.masses[gadget.masses.length - 1]);
  if (fuel >= 0) {
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

class Puzzle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gadgets: [],
      running: false
    };

    this.handleRunPuzzle = this.handleRunPuzzle.bind(this);
    this.step = this.step.bind(this);
  }

  render() {
    let items = this.state.gadgets.map(gadget =>
      <li key={gadget.id}>
        <span class="gadget-icon">
          <FontAwesomeIcon icon={gadget.icon} />
        </span>
        {gadget.masses[0]}
        <FontAwesomeIcon icon="oil-can" />
        {gadget.totalFuelMass}
      </li>
    );
    if (this.state.part1) {
      items.push(<li key="part1">{this.state.part1}</li>);
    }
    if (this.state.part2) {
      items.push(<li key="part2">{this.state.part2}</li>);
    }
    return (
      <div class="puzzle-2019-01">
        <ul>
          {items}
        </ul>
        <a href="#" onClick={this.handleRunPuzzle}>Run puzzleee</a>
      </div>
    )
  }

  async handleRunPuzzle() {
    const gadgets = (await getLines('input.txt')).map(line => parseInt(line, 10)).map((mass, idx) => ({
      id: `gadget-${idx}`,
      icon: icons[idx % icons.length],
      masses: [mass],
      totalFuelMass: 0
    }));
    this.setState({
      gadgets
    });
    setTimeout(this.step, 500);
  }

  async step() {
    let added = addFuelToAll(this.state.gadgets);
    this.setState({ gadgets: this.state.gadgets });
    console.log(added);
    if (added) {
      setTimeout(this.step, 500);
    } else {
      this.setState({
        part1: this.state.gadgets.reduce((sum, gadget) => {
          return sum + gadget.masses[1];
        }, 0),
        part2: this.state.gadgets.reduce((sum, gadget) => {
          return sum + gadget.masses.slice(1).reduce((sum, value) => sum + value, 0);
        }, 0)
      });
      console.log('done');
    }
  }
}

export default function Page() {
  return <div>
      <header>
        <FontAwesomeIcon icon="calendar" /> 2019
        <FontAwesomeIcon icon="calendar-day" /> Day 01
        <FontAwesomeIcon icon="puzzle-piece" /> The Tyranny of the Rocket Equation
      </header>
      <div>Hello world!</div>
      <FontAwesomeIcon icon="space-shuttle" />
      <FontAwesomeIcon icon="satellite" />
      <FontAwesomeIcon icon="wrench" />
      <FontAwesomeIcon icon="ethernet" />
      <FontAwesomeIcon icon="network-wired" />
      <FontAwesomeIcon icon="network-wired" />
      <Link to="/2019/02/">Go to Day 2</Link>
      <Puzzle />
    </div>
}