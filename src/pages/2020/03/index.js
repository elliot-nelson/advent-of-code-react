import React, { Component, Fragment } from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PuzzlePage from '../../../components/puzzle-page';
import { getPuzzleInput, loadImage, resizeCanvas } from '../../../utils/utils';
import './index.css';

/* Puzzle Solution */

function* solve(map, pos, slope) {
  // A hashmap of hit trees
  let collisions = {};

  // Count
  let trees = 0;

  // Speed will increase as time passes
  let speed = 0.1;

  // Track the "next" location to hit
  let next = { x: 0, y: 0 };

  // We keep track of 2 states here (`next` and `pos`).
  // The `pos` is fractional and moves along the slope line depending on speed.
  // The `next` is integer and tracks the next spot we'll check for a tree.
  //
  // (In this puzzle, we don't check for trees in between check spots, even
  // if a line drawn on paper would seem to pass through those trees.)
  while (next.y < map.length) {
    while (pos.x >= next.x && pos.y >= next.y && next.y < map.length) {
      if (map[next.y][next.x % map[0].length] === '#') {
        collisions[`${next.x},${next.y}`] = true;
        trees++;
      }
      next.x += slope.x;
      next.y += slope.y;
    }
    yield { pos, slope, collisions, trees };
    if (pos.y < map.length) {
      pos.x += slope.x * speed;
      pos.y += slope.y * speed;
    }
    speed *= 1.01;
  }
  return { pos, slope, collisions, trees };
}

/* Puzzle Visuals */

const FRAME_RATE = 1000 / 60;

class Puzzle extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef();
    this.state = {
      passwords: [],
      search1: [],
      search2: [],
      part1: 0,
      frame: 0
    };
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current;
    this.ctx = this.canvas.getContext('2d');
    this.frame = 0;
    this.camera = { x: 0, y: 0 };
    this.run();
  }

  render() {
    return (
      <div className="puzzle-2020-03">
        <canvas ref={this.canvasRef}></canvas>
        <div className="floater">
          {this.state.part1 &&
          <div className="solution part1"><FontAwesomeIcon icon="tree" /> {this.state.part1}</div>
          }
          {this.state.part2 &&
          <div className="solution part2"><FontAwesomeIcon icon="calculator" /> {this.state.part2}</div>
          }
        </div>
      </div>
    )
  }

  async run() {
    let input = await getPuzzleInput('input.txt');
    this.map = input.map(line => line.split(''));

    this.images = await Promise.all([
      loadImage('map1.png'),
      loadImage('map2.png'),
      loadImage('map3.png'),
      loadImage('map4.png')
    ]);

    this.solvePart1 = solve(this.map, { x: 0, y: 0 }, { x: 3, y: 1 });
    this.wait = 15;
    this.pos = [{ x: 0, y: 0 }];

    Object.assign(this, resizeCanvas(this.canvas, this.ctx, 480, 270, true, true));
    window.requestAnimationFrame(t => this.update(t));
  }

  async update(t) {
    if (t - this.lastTime < FRAME_RATE) {
      return window.requestAnimationFrame(t => this.update(t));
    }
    this.lastTime = t;
    this.frame++;

    if (this.wait && this.wait > 0) {
      this.wait--;
    } else if (this.solvePart1) {
      let result = this.solvePart1.next();
      if (result.value) {
        this.pos = [result.value.pos];
        this.collisions = [result.value.collisions];
        this.setState({ part1: result.value.trees });
      }
      if (result.done) {
        this.solvePart1 = undefined;
        this.solvePart2 = true;
        this.wait = 45;
      }
    } else if (this.solvePart2 === true) {
      this.solvePart2 = [
        solve(this.map, { x: 0, y: 0 }, { x: 1, y: 1 }),
        solve(this.map, { x: 0, y: 0 }, { x: 3, y: 1 }),
        solve(this.map, { x: 0, y: 0 }, { x: 5, y: 1 }),
        solve(this.map, { x: 0, y: 0 }, { x: 7, y: 1 }),
        solve(this.map, { x: 0, y: 0 }, { x: 1, y: 2 })
      ];
      this.pos = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
      this.collisions = [{}, {}, {}, {}, {}];
      this.trees = [0, 0, 0, 0, 0];
    } else if (this.solvePart2) {
      let done = false;
      for (let i = 0; i < this.solvePart2.length; i++) {
        let result = this.solvePart2[i].next();
        if (result.value) {
          this.pos[i] = result.value.pos;
          this.collisions[i] = result.value.collisions;
          this.trees[i] = result.value.trees;
        }
        done = done && result.done;
      }
      if (done) {
        this.solvePart2 = undefined;
      }
      this.setState({ part2: this.trees.reduce((a, value) => a * value) });
    }

    Object.assign(this, resizeCanvas(this.canvas, this.ctx, 480, 270, true));
    this.draw();

    window.requestAnimationFrame(t => this.update(t));
  }

  draw() {
    this.ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.width, this.height);

    if (!this.pos || !this.collisions) return;

    let focus = this.pos[(this.frame / 45 | 0) % this.pos.length];

    this.camera.x = this.camera.x * 0.7 + focus.x * 0.3;
    this.camera.y = this.camera.y * 0.7 + focus.y * 0.3;

    let offset = {
      x: this.width / 2 - this.camera.x * 8,
      y: this.height / 2 - this.camera.y * 8
    };

    this.ctx.translate(offset.x, offset.y);

    let sWidth = Math.ceil(this.width / 2 / 8),
        sHeight = Math.ceil(this.height / 2 / 8);
    for (let y = this.camera.y - sHeight | 0; y < this.camera.y + sHeight | 0; y++) {
      if (y >= 0 && y < this.map.length) {
        for (let x = this.camera.x - sWidth | 0; x < this.camera.x + sWidth | 0; x++) {
          this.ctx.drawImage(this.images[0], x * 8 - 4, y * 8 - 7);
        }
      }
    }

    for (let i = 0; i < this.pos.length; i++) {
      this.ctx.strokeStyle = 'red';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(this.pos[i].x * 8, this.pos[i].y * 8);
      this.ctx.stroke();
      this.ctx.drawImage(this.images[3], this.pos[i].x * 8 - 2, this.pos[i].y * 8 - 6);
    }

    for (let y = this.camera.y - sHeight | 0; y < this.camera.y + sHeight | 0; y++) {
      if (y >= 0 && y < this.map.length) {
        for (let x = this.camera.x - sWidth | 0; x < this.camera.x + sWidth | 0; x++) {
          let tree = this.map[y][(x + this.map[0].length) % this.map[0].length] === '#';
          let collide = this.collisions.find(c => c[`${x},${y}`]);
          if (collide) {
            this.ctx.drawImage(this.images[2], x * 8 - 4, y * 8 - 7);
          } else if (tree) {
            this.ctx.drawImage(this.images[1], x * 8 - 4, y * 8 - 7);
          }
        }
      }
    }
  }
}

export default function Page() {
  return <PuzzlePage year="2020" day="3" fullscreen="true">
    <Puzzle />
  </PuzzlePage>;
}
