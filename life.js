(function () {
  const canvas = document.getElementById('life');
  const ctx = canvas.getContext('2d');

  const cellSize = 5;
  let cols, rows;
  let grid, nextGrid;
  let generation = 0;
  let lastTime = 0;
  const interval = 100;

  function makeGrid(c, r) {
    return new Uint8Array(c * r);
  }

  function idx(x, y) {
    return y * cols + x;
  }

  function resizeGrid() {
    cols = Math.floor(canvas.width / cellSize);
    rows = Math.floor(canvas.height / cellSize);
    grid = makeGrid(cols, rows);
    nextGrid = makeGrid(cols, rows);
  }

  function randomize() {
    for (let i = 0; i < grid.length; i++) {
      grid[i] = Math.random() < 0.25 ? 1 : 0;
    }
    generation = 0;
  }

  function countNeighbors(x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = (x + dx + cols) % cols;
        const ny = (y + dy + rows) % rows;
        count += grid[idx(nx, ny)];
      }
    }
    return count;
  }

  function step() {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const alive = grid[idx(x, y)];
        const n = countNeighbors(x, y);
        let next = 0;
        if (alive && (n === 2 || n === 3)) next = 1;
        else if (!alive && n === 3) next = 1;
        nextGrid[idx(x, y)] = next;
      }
    }
    const tmp = grid;
    grid = nextGrid;
    nextGrid = tmp;
    generation++;

    let pop = 0;
    for (let i = 0; i < grid.length; i++) pop += grid[i];
    if (pop === 0 || generation > 2000) {
      randomize();
    }
  }

  function draw() {
    ctx.fillStyle = '#282828';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //ctx.strokeStyle = '#1c2620';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let x = 0; x <= cols; x++) {
      ctx.moveTo(x * cellSize + 0.5, 0);
      ctx.lineTo(x * cellSize + 0.5, rows * cellSize);
    }
    for (let y = 0; y <= rows; y++) {
      ctx.moveTo(0, y * cellSize + 0.5);
      ctx.lineTo(cols * cellSize, y * cellSize + 0.5);
    }
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.shadowColor = '';
    ctx.shadowBlur = cellSize > 8 ? 4 : 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[idx(x, y)]) {
          ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 1, cellSize - 1);
        }
      }
    }
    ctx.shadowBlur = 0;
  }

  function loop(time) {
    if (time - lastTime >= interval) {
      lastTime = time;
      step();
      draw();
    }
    requestAnimationFrame(loop);
  }

  resizeGrid();
  randomize();
  draw();
  requestAnimationFrame(loop);
})();
