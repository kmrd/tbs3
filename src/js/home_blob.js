const { createNoise2D } = require('simplex-noise');
const { spline } = require('@georgedoescode/spline');

export class Blob {
  angleStep;   // used to equally space each point around the circle
  points = [];
  numPoints;
  radius;
  wiggleDelta = 10;
  noiseDeltaT = 0.006; // how fast we progress through "time"
  noiseFn;

  bubbleEl;

  animation;

  constructor(bubbleEl, points = 6, radius = 75) {
    this.numPoints = points;
    this.angleStep = (Math.PI * 2) / this.numPoints;
    this.radius = radius;

    this.nosieFn = createNoise2D();

    if (typeof bubbleEl === 'string') {
      this.bubbleEl = document.querySelector(bubbleEl);
    } else {
      this.bubbleEl = bubbleEl;
    }

    this.createPoints();
  }

  createPoints() {
    for (let i = 1; i <= this.numPoints; i++) {
      // x & y coordinates of the current point
      const theta = i * this.angleStep;

      const x = 100 + Math.cos(theta) * this.radius;
      const y = 100 + Math.sin(theta) * this.radius;

      // store the point
      this.points.push({
        x: x,
        y: y,
        /* we need to keep a reference to the point's original {x, y} coordinates 
        for when we modulate the values later */
        originX: x,
        originY: y,
        // more on this in a moment!
        noiseOffsetX: Math.random() * 1000,
        noiseOffsetY: Math.random() * 1000,
      });
    }

    return this.getPoints();
  }

  getPoints() {
    return this.points;
  }

  // map a number from 1 range to another
  remapRange(n, start1, end1, start2, end2) {
    return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
  }

  nextFrame() {
    for (let i = 0; i < this.getPoints().length; i++) {
      this.bubbleEl.setAttribute("d", spline(this.getPoints(), 1, true));

      const point = this.points[i];

      // return a pseudo random value between -1 / 1 based on this point's current x, y positions in "time"
      const nX = this.nosieFn(point.noiseOffsetX, point.noiseOffsetX);
      const nY = this.nosieFn(point.noiseOffsetY, point.noiseOffsetY);
      // map this noise value to a new value, somewhere between it's original location -20 and it's original location + 20
      const x = this.remapRange(nX, -1, 1, point.originX - this.wiggleDelta, point.originX + this.wiggleDelta);
      const y = this.remapRange(nY, -1, 1, point.originY - this.wiggleDelta, point.originY + this.wiggleDelta);

      // update the point's current coordinates
      point.x = x;
      point.y = y;

      // progress the point's x, y values through "time"
      point.noiseOffsetX += this.noiseDeltaT;
      point.noiseOffsetY += this.noiseDeltaT;
    }
    this.startAnimation();
  }

  startAnimation() {
    requestAnimationFrame(() => this.nextFrame());
  }

}