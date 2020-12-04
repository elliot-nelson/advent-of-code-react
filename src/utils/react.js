// React utilities
//
// Utilities for React implementations

/**
 * Retrieve a puzzle input as an array of lines.
 */
export async function getPuzzleInput(filename) {
  const data = await fetch(filename).then(result => result.text());
  let lines = data.split('\n');
  if (lines[lines.length - 1] === '') lines.splice(-1);
  return lines;
}

export async function loadImage(filename) {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = filename;
  });
}

/**
 * Puzzle paths.
 */
export function puzzlePath(year, day) {
  return `/${year}/${String(day).padStart(2, '0')}/`;
}

/**
 * Take a given width & height and compare it to the actual client width & height,
 * returning the best `scale` that will fit the desired width and height onto the screen
 * (with extra padding either left/right or top/bottom).
 */
export function canvasFitDimensions(canvas, ctx, width, height) {
    let dpi = window.devicePixelRatio;
    let xScale = canvas.clientWidth * dpi / width;
    let yScale = canvas.clientHeight * dpi / height;

    canvas.width = canvas.clientWidth * dpi;
    canvas.height = canvas.clientHeight * dpi;

    return {
        scale: Math.floor(Math.min(xScale, yScale) * 100000) / 100000
    };
}

/**
 * Resize a canvas
 */
export function resizeCanvas(canvas, ctx, desiredWidth, desiredHeight, zoom, force) {
  let dpi = window.devicePixelRatio,
    width = canvas.clientWidth,
    height = canvas.clientHeight,
    dpiWidth = width * dpi,
    dpiHeight = height * dpi;
  let comp = zoom ? Math.max : Math.min;

  if (
      force ||
      canvas.width !== dpiWidth ||
      canvas.height !== dpiHeight
  ) {
      canvas.width = dpiWidth;
      canvas.height = dpiHeight;

      let scale = ((comp(dpiWidth / desiredWidth, dpiHeight / desiredHeight) * 10) | 0) / 10;
      let width = Math.ceil(dpiWidth / scale);
      let height = Math.ceil(dpiHeight / scale);
      let center = {
          x: (width / 2) | 0,
          y: (height / 2) | 0
      };

      // Note: smoothing flag gets reset on every resize by some browsers, which is why
      // we do it here.
      ctx.imageSmoothingEnabled = false;

      return { scale, width, height, center };
  }

  return {};
}
