const rows = 10;
const cols = 10;
const mineCount = 15;

let board = [];
let mines = [];

function initGame() {
  board = [];
  mines = [];
  const game = document.getElementById('game');
  game.innerHTML = '';
  game.style.width = cols * 32 + 'px';

  // 初始化空白格子
  for (let r = 0; r < rows; r++) {
    const row = [];
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', onCellClick);
      cell.addEventListener('contextmenu', onCellRightClick);
      rowDiv.appendChild(cell);
      row.push({ element: cell, mine: false, adjacent: 0, revealed: false, flagged: false });
    }
    board.push(row);
    game.appendChild(rowDiv);
  }

  // 随机布雷
  while (mines.length < mineCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      mines.push([r, c]);
    }
  }

  // 计算相邻雷数
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      board[r][c].adjacent = countAdjacentMines(r, c);
    }
  }
}

function countAdjacentMines(r, c) {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        if (board[nr][nc].mine) count++;
      }
    }
  }
  return count;
}

function onCellClick(e) {
  const r = parseInt(e.target.dataset.row);
  const c = parseInt(e.target.dataset.col);
  revealCell(r, c);
}

function onCellRightClick(e) {
  e.preventDefault();
  const cell = e.target;
  if (cell.classList.contains('revealed')) return;
  cell.classList.toggle('flagged');
  cell.textContent = cell.classList.contains('flagged') ? '🚩' : '';
}

function revealCell(r, c) {
  const cell = board[r][c];
  if (cell.revealed || cell.flagged) return;
  cell.revealed = true;
  cell.element.classList.add('revealed');
  if (cell.mine) {
    cell.element.classList.add('mine');
    cell.element.textContent = '💣';
    gameOver(false);
    return;
  }
  if (cell.adjacent > 0) {
    cell.element.textContent = cell.adjacent;
  } else {
    // 递归展开
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          revealCell(nr, nc);
        }
      }
    }
  }
  checkWin();
}

function gameOver(win) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r][c];
      if (cell.mine && !cell.element.classList.contains('flagged')) {
        cell.element.classList.add('mine');
        cell.element.textContent = '💣';
      }
      cell.element.classList.add('revealed');
    }
  }
  setTimeout(() => {
    alert(win ? '恭喜，你赢了！' : '你踩雷了，游戏结束！');
  }, 100);
}

function checkWin() {
  let revealedCount = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].revealed && !board[r][c].mine) {
        revealedCount++;
      }
    }
  }
  if (revealedCount === rows * cols - mineCount) {
    gameOver(true);
  }
}

// 初始化游戏
initGame();
