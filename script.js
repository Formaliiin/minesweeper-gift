const SIZE = 9;
const MINES = 10;
let board = [];
let revealed = [];
let flagged = [];
let gameOver = false;
let minesLeft = MINES;

function createBoard() {
  board = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  revealed = Array(SIZE).fill().map(() => Array(SIZE).fill(false));
  flagged = Array(SIZE).fill().map(() => Array(SIZE).fill(false));
  minesLeft = MINES;
  updateMinesLeft();

  // Расставляем мины
  let minesPlaced = 0;
  while (minesPlaced < MINES) {
    const r = Math.floor(Math.random() * SIZE);
    const c = Math.floor(Math.random() * SIZE);
    if (board[r][c] !== -1) {
      board[r][c] = -1;
      minesPlaced++;
      // Обновляем цифры вокруг
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] !== -1) {
            board[nr][nc]++;
          }
        }
      }
    }
  }
  render();
}

function render() {
  const gameDiv = document.getElementById('game');
  gameDiv.innerHTML = '';
  for (let r = 0; r < SIZE; r++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';
    for (let c = 0; c < SIZE; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (revealed[r][c]) {
        cell.classList.add('revealed');
        if (board[r][c] === -1) {
          cell.classList.add('mine');
          cell.textContent = '💣';
        } else {
          cell.textContent = board[r][c] || '';
          cell.dataset.value = board[r][c];
        }
      } else if (flagged[r][c]) {
        cell.classList.add('flag');
        cell.textContent = '🚩';
      }

      cell.dataset.row = r;
      cell.dataset.col = c;

      cell.addEventListener('click', handleCellClick);
      cell.addEventListener('contextmenu', handleRightClick);

      rowDiv.appendChild(cell);
    }
    gameDiv.appendChild(rowDiv);
  }
}

function handleCellClick(e) {
  const r = parseInt(e.target.dataset.row);
  const c = parseInt(e.target.dataset.col);

  if (gameOver || revealed[r][c] || flagged[r][c]) return;

  if (board[r][c] === -1) {
    gameOver = true;
    revealAll();
    setTimeout(() => alert('💥 Ой-ой Это была мина Но ты всё равно у меня самая умная'), 100);
    return;
  }

  reveal(r, c);
  checkWin();
}

function handleRightClick(e) {
  e.preventDefault();
  const r = parseInt(e.target.dataset.row);
  const c = parseInt(e.target.dataset.col);

  if (gameOver || revealed[r][c]) return;

  if (!flagged[r][c]) {
    flagged[r][c] = true;
    minesLeft--;
  } else {
    flagged[r][c] = false;
    minesLeft++;
  }
  updateMinesLeft();
  render();
}

function reveal(r, c) {
  if (r < 0 || r >= SIZE || c < 0 || c >= SIZE || revealed[r][c]) return;
  revealed[r][c] = true;

  if (board[r][c] === 0) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        reveal(r + dr, c + dc);
      }
    }
  }
}

function revealAll() {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      revealed[r][c] = true;
    }
  }
  render();
}

function updateMinesLeft() {
  document.getElementById('mines-left').textContent = minesLeft;
}

function checkWin() {
  let hiddenSafeCells = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!revealed[r][c] && board[r][c] !== -1) {
        hiddenSafeCells++;
      }
    }
  }
  if (hiddenSafeCells === 0) {
    gameOver = true;
    setTimeout(() => alert('🎉 Ура Ты нашла все мины Ты гений'), 100);
  }
}

function reset() {
  gameOver = false;
  createBoard();
}

// Запуск
createBoard();
