const puzzleContainer = document.getElementById('puzzle-container');
const originalImage = new Image();
originalImage.src = 'foto/gatofeo.jpg'; 
const confettiContainer = document.getElementById('confetti-container');
const referenceImage = document.getElementById('reference-image');
let pieces = [];
const rows = 3; 
const cols = 3; 

function startPuzzle() {
  
  puzzleContainer.innerHTML = '';
  pieces = [];
  confettiContainer.innerHTML = ''; 

  
  const imgWidth = originalImage.width; 
  const imgHeight = originalImage.height; 

 
  puzzleContainer.style.width = `${imgWidth}px`;
  puzzleContainer.style.height = `${imgHeight}px`;


  const pieceWidth = imgWidth / cols;
  const pieceHeight = imgHeight / rows;

 
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const piece = document.createElement('div');
      piece.className = 'puzzle-piece';
      piece.style.width = `${pieceWidth}px`;
      piece.style.height = `${pieceHeight}px`;
      piece.style.backgroundImage = `url('${originalImage.src}')`;
      piece.style.backgroundPosition = `-${j * pieceWidth}px -${i * pieceHeight}px`;
  
      piece.style.top = `${Math.random() * (puzzleContainer.offsetHeight - pieceHeight)}px`;
      piece.style.left = `${Math.random() * (puzzleContainer.offsetWidth - pieceWidth)}px`;
      piece.dataset.expectedRow = i; 
      piece.dataset.expectedCol = j; 
      puzzleContainer.appendChild(piece);
      pieces.push(piece);
    }
  }

 
  makePiecesDraggable();
}

function makePiecesDraggable() {
  pieces.forEach(piece => {
    piece.addEventListener('mousedown', startDrag);
    piece.addEventListener('touchstart', startDrag, { passive: false });
  });
}

let selectedPiece = null;

function startDrag(e) {
  e.preventDefault();
  selectedPiece = e.target;
  document.addEventListener('mousemove', dragPiece);
  document.addEventListener('touchmove', dragPiece, { passive: false });
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);
}

function dragPiece(e) {
  if (selectedPiece) {
    const containerRect = puzzleContainer.getBoundingClientRect();
    const pieceWidth = selectedPiece.offsetWidth;
    const pieceHeight = selectedPiece.offsetHeight;

   
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  
    let newTop = clientY - containerRect.top - pieceHeight / 2;
    let newLeft = clientX - containerRect.left - pieceWidth / 2;


    newTop = Math.max(0, Math.min(newTop, containerRect.height - pieceHeight));
    newLeft = Math.max(0, Math.min(newLeft, containerRect.width - pieceWidth));

    selectedPiece.style.top = `${newTop}px`;
    selectedPiece.style.left = `${newLeft}px`;
  }
}

function stopDrag() {
  if (selectedPiece) {
 
    snapToGrid(selectedPiece);
    selectedPiece = null;
  }
  document.removeEventListener('mousemove', dragPiece);
  document.removeEventListener('touchmove', dragPiece);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);
  checkPuzzle();
}

function snapToGrid(piece) {
  const pieceWidth = piece.offsetWidth;
  const pieceHeight = piece.offsetHeight;


  const currentTop = parseFloat(piece.style.top);
  const currentLeft = parseFloat(piece.style.left);


  const row = Math.round(currentTop / pieceHeight);
  const col = Math.round(currentLeft / pieceWidth);


  const expectedTop = row * pieceHeight;
  const expectedLeft = col * pieceWidth;

  piece.style.top = `${expectedTop}px`;
  piece.style.left = `${expectedLeft}px`;


  piece.dataset.row = row;
  piece.dataset.col = col;
}

function checkPuzzle() {
  let isComplete = true;
  pieces.forEach(piece => {
    const expectedRow = parseInt(piece.dataset.expectedRow);
    const expectedCol = parseInt(piece.dataset.expectedCol);
    const currentRow = parseInt(piece.dataset.row);
    const currentCol = parseInt(piece.dataset.col);


    if (currentRow !== expectedRow || currentCol !== expectedCol) {
      isComplete = false;
    }
  });

  if (isComplete) {
    showConfetti(50); 
  }
}

function showConfetti(amount = 100) {
  for (let i = 0; i < amount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}vw`; 
    confetti.style.animationDuration = `${Math.random() * 2 + 1}s`;
    confettiContainer.appendChild(confetti);
  }
}


originalImage.onload = () => {
  console.log('Imagen cargada correctamente');
  startPuzzle(); 
};