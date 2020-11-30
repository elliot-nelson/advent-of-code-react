/* Utilities */

/**
 * Retrieve a puzzle input as an array of lines.
 */
export async function getPuzzleInput(filename) {
  const data = await fetch(filename).then(result => result.text());
  let lines = data.split('\n');
  if (lines[lines.length - 1] === '') lines.splice(-1);
  return lines;
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
