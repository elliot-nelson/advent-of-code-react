import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './index.css';
import Layout from '../../../components/layout';
import { getPuzzleInput, canvasFitDimensions } from '../../../utils/utils';

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

const FRAME_RATE = 1000 / 60;

class Puzzle extends React.Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef();
    this.state = {};
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current;
    this.ctx = this.canvas.getContext('2d');
    this.lastFrame = 0;
    this.path = [];
    this.bounds = { top: 0, bottom: 0, left: 0, right: 0 };

    this.assets = {
      grid: new Image()
    };
    this.assets.grid.src = 'city-grid.png';
    this.assets.grid.onload = () => {
      this.run('input.txt');
    };
  }

  componentWillUnmount() {
    this.unloaded = true;
  }

  render() {
    return (
      <div className="puzzle-2016-01">
        <canvas ref={this.canvasRef}></canvas>
      </div>
    );
  }

  async run(filename) {

    const instructions = (await getPuzzleInput(filename))[0].split(', ');
    let steps = splitInstructions(instructions);
    this.walk = followSteps(steps);
    this.update(0);
    return;
/*
    for (let result = walk.next(); !result.done; result = walk.next()) {
      console.log(result);
      console.log(steps);
      if (result.value.revisited.length > 0) {
        console.log(blocksAway(result.value.revisited[0][0], result.value.revisited[0][1]));
      }
      console.log(blocksAway(result.value.x, result.value.y));
    }
    */
  }

  update(delta) {
    if (this.unloaded) return;

    if (delta - this.lastFrame >= FRAME_RATE) {
      this.lastFrame = delta;

      let result = this.walk.next();
      if (result.done) return;

      this.last = this.current;
      this.current = result.value;
      this.path.push([this.current.x, this.current.y]);
      this.resize();
      this.draw();
    }

    window.requestAnimationFrame(t => this.update(t));
  }

  resize() {
    this.bounds.top = Math.min(this.bounds.top, this.current.y);
    this.bounds.bottom = Math.max(this.bounds.bottom, this.current.y);
    this.bounds.left = Math.min(this.bounds.left, this.current.x);
    this.bounds.right = Math.max(this.bounds.right, this.current.x);
    this.width = (this.bounds.right - this.bounds.left) * 11 * 1.1;
    this.height = (this.bounds.bottom - this.bounds.top) * 11 * 1.1;

    this.scale = canvasFitDimensions(this.canvas, this.ctx, this.width, this.height).scale;
    this.ctx.imageSmoothingEnabled = false;
  }

  draw() {
    this.ctx.setTransform(this.scale, 0, 0, this.scale, this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.translate(-this.bounds.left * 11 - this.width / 2, -this.bounds.top * 11 - this.height / 2);

    //this.ctx.drawImage(this.assets.grid, -31, -31);
    //this.ctx.drawImage(this.assets.grid, -31 + 44, -31);

    if (this.current && this.last) {
      this.ctx.strokeStyle = 'red';
      this.ctx.beginPath();
      this.ctx.moveTo(this.path[0][0] * 11, this.path[0][1] * 11);
      for (let i = 1; i < this.path.length; i++) {
        this.ctx.lineTo(this.path[i][0] * 11, this.path[i][1] * 11);
        this.ctx.drawImage(this.assets.grid, this.path[i][0] * 11 - 31, this.path[i][1] * 11 - 31);
      }
      this.ctx.stroke();
    }

    console.log(this.current, this.width, this.height, this.TOTAL);

    /*this.ctx.setTransform(this.scale, 0, 0, this.scale, this.canvas.width / 2, this.canvas.height / 2);

    for (let i = 0; i < 50; i++) {
      this.ctx.strokeStyle = 'yellow';
      this.ctx.lineWidth = 25;
      this.ctx.setLineDash([]);
      this.ctx.moveTo(0, -50 + i * 100);
      this.ctx.lineTo(1000, -50 + i * 100);
      this.ctx.stroke();
    }

    this.ctx.strokeStyle = '#494949';
    this.ctx.lineWidth = 21;
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(1000, 0);
    this.ctx.stroke();

    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 3;
    this.ctx.setLineDash([13, 12]);
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(1000, 0);
    this.ctx.stroke();
*/
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
