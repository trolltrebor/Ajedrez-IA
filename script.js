let board = null;
let game = new Chess();

let timerWhite = 300; // 5 minutos en segundos
let timerBlack = 300;

let timerInterval = null;
let turn = 'w';

const timerWhiteEl = document.getElementById('timerWhite');
const timerBlackEl = document.getElementById('timerBlack');
const statusEl = document.getElementById('status');
const levelSelect = document.getElementById('level');
const startBtn = document.getElementById('startBtn');

function updateTimers() {
  if (turn === 'w') {
    timerWhite--;
    if (timerWhite <= 0) {
      endGame('Tiempo agotado para Blancas. Gana Negro.');
    }
  } else {
    timerBlack--;
    if (timerBlack <= 0) {
      endGame('Tiempo agotado para Negras. Gana Blanco.');
    }
  }
  timerWhiteEl.textContent = formatTime(timerWhite);
  timerBlackEl.textContent = formatTime(timerBlack);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

function endGame(message) {
  clearInterval(timerInterval);
  statusEl.textContent = message;
  board.position(game.fen());
  board.orientation('white');
  board.draggable = false;
}

function makeAiMove() {
  let moves = game.moves();
  if (moves.length === 0) {
    endGame('Juego terminado.');
    return;
  }

  const level = parseInt(levelSelect.value);

  // IA simple: movimiento al azar o priorizando capturas
  let move = null;
  if (level === 1) {
    move = moves[Math.floor(Math.random() * moves.length)];
  } else if (level === 2) {
    let captureMoves = moves.filter(m => m.includes('x'));
    if (captureMoves.length > 0) {
      move = captureMoves[Math.floor(Math.random() * captureMoves.length)];
    } else {
      move = moves[Math.floor(Math.random() * moves.length)];
    }
  } else {
    move = moves[Math.floor(Math.random() * moves.length)];
  }

  game.move(move);
  board.position(game.fen());
  turn = 'w';
  statusEl.textContent = "Turno de Blanco";
}

function onDrop(source, target) {
  let move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) return 'snapback';

  board.position(game.fen());
  turn = 'b';
  statusEl.textContent = "Turno de Negro (IA)";

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    updateTimers();
  }, 1000);

  setTimeout(() => {
    makeAiMove();
  }, 1000);
}

function onSnapEnd() {
  board.position(game.fen());
}

function startGame() {
  game.reset();
  board.start();
  turn = 'w';
  timerWhite = 300;
  timerBlack = 300;
  statusEl.textContent = "Turno de Blanco";
  timerWhiteEl.textContent = formatTime(timerWhite);
  timerBlackEl.textContent = formatTime(timerBlack);

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    updateTimers();
  }, 1000);

  board.draggable = true;
}

board = Chessboard('board', {
  draggable: true,
  position: 'start',
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
});

startBtn.addEventListener('click', startGame);