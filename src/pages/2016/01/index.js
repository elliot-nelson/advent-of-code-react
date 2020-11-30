import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './index.css';
import Layout from '../../../components/layout';
import { getPuzzleInput } from '../../../utils/utils';

/* Puzzle Solution */

// Prepare instructions for easy use
function splitInstructions(instructions) {
  let steps = [];

  for (let instruction of instructions) {
    steps.push(instruction[0]);
    steps.push(parseInt(instruction.slice(1), 10));
  }

  return steps;
}

// Generator function to actually follow the instructions, one step at a time
function* followSteps(steps) {
  // Directions: 0 = N, 1 = E, 2 = S, 3 = W
  const direction = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
  ];

  // Track current position and the direction we are facing
  let x = 0, y = 0, facing = 0;

  // A hash, to track whether we've visited a square before
  let visited = {};

  // A list of places we've revisited, in order of occurrence
  let revisited = [];

  while (steps.length > 0) {
    if (steps[0] === 'L') {
      facing = (facing + 3) % 4;
      steps.shift();
    } else if (steps[0] === 'R') {
      facing = (facing + 1) % 4;
      steps.shift();
    } else {
      x += direction[facing][0];
      y += direction[facing][1];

      if (visited[`${x},${y}`]) revisited.push([x, y]);
      visited[`${x},${y}`] = true;

      steps[0]--;
      if (steps[0] <= 0) steps.shift();
    }

    yield { x, y, facing, nextSteps: steps, revisited };
  }
}

// Calculate number of blocks away
function blocksAway(x, y) {
  return Math.abs(x) + Math.abs(y);
}

/* Puzzle Visuals */

class Puzzle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    };
  }

  componentDidMount() {
    this.run('input.txt');
  }

  render() {
    return (
      <p>Hello</p>
    );
  }

  async run(filename) {
    const instructions = (await getPuzzleInput(filename))[0].split(', ');
    let steps = splitInstructions(instructions);
    let walk = followSteps(steps);
    for (let result = walk.next(); !result.done; result = walk.next()) {
      console.log(result);
      console.log(steps);
      if (result.value.revisited.length > 0) {
        console.log(blocksAway(result.value.revisited[0][0], result.value.revisited[0][1]));
      }
      console.log(blocksAway(result.value.x, result.value.y));
    }
  }
}

export default function Page() {
  return <Layout>
      <header>
        <FontAwesomeIcon icon="star" /> No Time for a Taxicab <span>(2016 Day 1)</span>
      </header>
      <Puzzle />
    </Layout>
}
