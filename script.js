/* ================================
   Mini Paint App – Core Logic
   ================================ */

/* ----------- CONSTANTS ----------- */
// DOM elements
const canvas     = document.getElementById('drawingCanvas');
const ctx        = canvas.getContext('2d');          // 2-D rendering context
const colorInput = document.getElementById('colorPicker');
const clearBtn   = document.getElementById('clearBtn');

/* ----------- STATE ----------- */
let drawing = false; // Are we currently drawing?
let lastX = 0;       // Last pointer X position
let lastY = 0;       // Last pointer Y position

/* ---------------------------------
   Resize canvas to fit its element
   (handles high-DPI “retina” screens)
----------------------------------- */
function resizeCanvas() {
  // Match canvas size to its CSS-rendered size
  const { offsetWidth: width, offsetHeight: height } = canvas;

  // Multiply by device pixel ratio to keep lines crisp
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = width  * dpr;
  canvas.height = height * dpr;

  // Scale drawing operations back down
  ctx.scale(dpr, dpr);

  // Set initial stroke parameters
  ctx.lineCap   = 'round';
  ctx.lineJoin  = 'round';
  ctx.lineWidth = 5;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial call

/* ---------------------------------
   Pointer utility: unify mouse & touch
----------------------------------- */
function getPointerPos(evt) {
  // Handle both touch and mouse events
  if (evt.touches && evt.touches.length) {
    return {
      x: evt.touches[0].clientX - canvas.getBoundingClientRect().left,
      y: evt.touches[0].clientY - canvas.getBoundingClientRect().top
    };
  }
  return {
    x: evt.clientX - canvas.getBoundingClientRect().left,
    y: evt.clientY - canvas.getBoundingClientRect().top
  };
}

/* ----------- DRAWING ----------- */
function startDrawing(evt) {
  drawing = true;
  const { x, y } = getPointerPos(evt);
  [lastX, lastY] = [x, y];
  evt.preventDefault(); // Prevent touch scrolling
}

function draw(evt) {
  if (!drawing) return;
  const { x, y } = getPointerPos(evt);

  ctx.strokeStyle = colorInput.value; // Current color
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  [lastX, lastY] = [x, y];
  evt.preventDefault();
}

function stopDrawing() {
  drawing = false;
}

/* ---- Event listeners (mouse) ---- */
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

/* ---- Event listeners (touch) ---- */
canvas.addEventListener('touchstart', startDrawing, { passive: false });
canvas.addEventListener('touchmove', draw,           { passive: false });
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

/* ----------- CLEAR CANVAS ----------- */
clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});