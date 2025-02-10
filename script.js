const qrText = 'https://www.youtube.com/shorts/41iWg91yFv0';
const qrSize = 300; // Reduced size for 3x3
const pieces = 3;  // Changed to 3x3
const pieceSize = qrSize / pieces;
let puzzleContainer, emptyX, emptyY;
let imageURL;

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Could not load image'));
        image.crossOrigin = "anonymous"; // Add this to handle CORS
        image.src = url;
    });
}

// Add this to your existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', async () => {
    puzzleContainer = document.getElementById('puzzle-container');
    const shuffleButton = document.getElementById('shuffle-button');
    
    // Add event listener for shuffle button
    shuffleButton.addEventListener('click', shufflePuzzle);
    
    try {
        imageURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtexwZdQi92pIVJsxG0-6yTnSzSKS6wexQYQ&s";
        const image = await loadImage(imageURL);
        createPuzzle(image);
    } catch (error) {
        console.error('Error loading image:', error);
        document.getElementById('message').innerText = 'Failed to load image';
    }
});

let correctPieceOrder = [];

function createPuzzle(image) {
    const context = createContextFromImage(image);
    const piecesArray = [];
    
    for (let y = 0; y < pieces; y++) {
        for (let x = 0; x < pieces; x++) {
            if (x === pieces - 1 && y === pieces - 1) {
                emptyX = x;
                emptyY = y;
                piecesArray.push(null);
                correctPieceOrder.push(null); // Store null for the empty piece
                continue;
            }
            
            const canvas = document.createElement('canvas');
            canvas.width = pieceSize;
            canvas.height = pieceSize;
            const ctx = canvas.getContext('2d');
            ctx.putImageData(context.getImageData(x * pieceSize, y * pieceSize, pieceSize, pieceSize), 0, 0);
            canvas.classList.add('puzzle-piece');
            canvas.dataset.x = x;
            canvas.dataset.y = y;
            piecesArray.push(canvas);
            correctPieceOrder.push({ x, y }); // Store the correct position of the piece
        }
    }
    
    shuffle(piecesArray);
    renderPuzzle(piecesArray);
}


function createContextFromImage(image) {
    const canvas = document.createElement('canvas');
    canvas.width = qrSize;
    canvas.height = qrSize;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, qrSize, qrSize);
    return ctx;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    document.getElementById('message').innerText = '!Solve It!';

}

function renderPuzzle(piecesArray) {
    puzzleContainer.innerHTML = '';
    piecesArray.forEach((piece, index) => {
        if (piece) {
            piece.style.left = `${(index % pieces) * pieceSize}px`;
            piece.style.top = `${Math.floor(index / pieces) * pieceSize}px`;
            piece.dataset.order = index;
            piece.addEventListener('mousedown', handleMouseDown);
            piece.addEventListener('touchstart', handleTouchStart, { passive: false });
        } else {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('puzzle-piece', 'hidden');
            emptyDiv.style.left = `${(index % pieces) * pieceSize}px`;
            emptyDiv.style.top = `${Math.floor(index / pieces) * pieceSize}px`;
            emptyDiv.dataset.x = index % pieces;
            emptyDiv.dataset.y = Math.floor(index / pieces);
            puzzleContainer.appendChild(emptyDiv);
            return;
        }
        puzzleContainer.appendChild(piece);
    });
}

function handleMouseDown(event) {
    const piece = event.target;
    const rect = piece.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const onMouseMove = (e) => {
        const containerRect = puzzleContainer.getBoundingClientRect();
        let x = e.clientX - containerRect.left - offsetX;
        let y = e.clientY - containerRect.top - offsetY;
        x = Math.max(0, Math.min(x, qrSize - pieceSize));
        y = Math.max(0, Math.min(y, qrSize - pieceSize));
        piece.style.transform = `translate(${x - parseInt(piece.style.left)}px, ${y - parseInt(piece.style.top)}px)`;
    };

    const onMouseUp = (e) => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        piece.style.transform = 'translate(0, 0)';
        movePiece(piece, offsetX, offsetY);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

function handleTouchStart(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const piece = event.target;
    const rect = piece.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;

    const onTouchMove = (e) => {
        const touch = e.touches[0];
        const containerRect = puzzleContainer.getBoundingClientRect();
        let x = touch.clientX - containerRect.left - offsetX;
        let y = touch.clientY - containerRect.top - offsetY;
        x = Math.max(0, Math.min(x, qrSize - pieceSize));
        y = Math.max(0, Math.min(y, qrSize - pieceSize));
        piece.style.transform = `translate(${x - parseInt(piece.style.left)}px, ${y - parseInt(piece.style.top)}px)`;
    };

    const onTouchEnd = () => {
        piece.style.transform = 'translate(0, 0)';
        movePiece(piece, offsetX, offsetY);
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
}


function solvePuzzle() {
    const imageElement = new Image();
    imageElement.src = imageURL;
    imageElement.onload = () => {
        const context = createContextFromImage(imageElement);
        const piecesArray = [];
        const puzzleContainer = document.getElementById('puzzle-container');
        document.getElementById('message').innerText = 'Puzzle Solved!';


        for (let y = 0; y < pieces; y++) {
            for (let x = 0; x < pieces; x++) {
                if (x === pieces - 1 && y === pieces - 1) {
                    emptyX = x;
                    emptyY = y;
                    piecesArray.push(null);
                    continue;
                }
                
                const canvas = document.createElement('canvas');
                canvas.width = pieceSize;
                canvas.height = pieceSize;
                const ctx = canvas.getContext('2d');
                ctx.putImageData(context.getImageData(x * pieceSize, y * pieceSize, pieceSize, pieceSize), 0, 0);
                canvas.classList.add('puzzle-piece');
                canvas.dataset.x = x;
                canvas.dataset.y = y;
                piecesArray.push(canvas);
            }
        }

        // Arrange pieces according to the correctPieceOrder
        correctPieceOrder.forEach((position, index) => {
            if (position !== null) {
                const { x, y } = position;
                const piece = piecesArray.find(piece => parseInt(piece.dataset.x) === x && parseInt(piece.dataset.y) === y);
                const correctX = index % 4;
                const correctY = Math.floor(index / 4);
                const targetX = correctX * pieceSize;
                const targetY = correctY * pieceSize;

                // Animate the transition of the piece to its target position
                piece.style.transition = 'left 0.5s, top 0.5s';
                piece.style.left = `${targetX}px`;
                piece.style.top = `${targetY}px`;
                piece.dataset.x = correctX;
                piece.dataset.y = correctY;
            }
        });

        // Display the solved puzzle
        puzzleContainer.innerHTML = '';
        piecesArray.forEach(piece => puzzleContainer.appendChild(piece));
    };


}



function movePiece(piece, offsetX, offsetY) {
    const pieceX = Math.floor(parseInt(piece.style.left) / pieceSize);
    const pieceY = Math.floor(parseInt(piece.style.top) / pieceSize);
    const emptyDiv = puzzleContainer.querySelector('.hidden');
    const emptyX = Math.floor(parseInt(emptyDiv.style.left) / pieceSize);
    const emptyY = Math.floor(parseInt(emptyDiv.style.top) / pieceSize);

    if (Math.abs(emptyX - pieceX) + Math.abs(emptyY - pieceY) === 1) {
        // Swap positions
        const tempLeft = piece.style.left;
        const tempTop = piece.style.top;
        
        piece.style.left = emptyDiv.style.left;
        piece.style.top = emptyDiv.style.top;
        emptyDiv.style.left = tempLeft;
        emptyDiv.style.top = tempTop;

        // Update data attributes
        [piece.dataset.x, emptyDiv.dataset.x] = [emptyDiv.dataset.x, piece.dataset.x];
        [piece.dataset.y, emptyDiv.dataset.y] = [emptyDiv.dataset.y, piece.dataset.y];

        checkSolved();
    }
}

function checkSolved() {
    let solved = true;
    const pieces = puzzleContainer.querySelectorAll('.puzzle-piece:not(.hidden)');
    pieces.forEach((piece) => {
        const currentX = parseInt(piece.dataset.x);
        const currentY = parseInt(piece.dataset.y);
        const originalX = parseInt(piece.dataset.originalX);
        const originalY = parseInt(piece.dataset.originalY);
        
        if (currentX !== originalX || currentY !== originalY) {
            solved = false;
        }
    });

    document.getElementById('message').innerText = solved ? 'Puzzle Solved!' : '!Solve It!';
}

// Update the shufflePuzzle function
function shufflePuzzle() {
    const pieces = Array.from(puzzleContainer.querySelectorAll('.puzzle-piece'));
    const emptyPiece = pieces.find(piece => piece.classList.contains('hidden'));
    const movablePieces = pieces.filter(piece => !piece.classList.contains('hidden'));
    
    // Perform random moves
    for (let i = 0; i < 50; i++) {
        const emptyX = parseInt(emptyPiece.dataset.x);
        const emptyY = parseInt(emptyPiece.dataset.y);
        
        // Find adjacent pieces
        const adjacentPieces = movablePieces.filter(piece => {
            const pieceX = parseInt(piece.dataset.x);
            const pieceY = parseInt(piece.dataset.y);
            return Math.abs(emptyX - pieceX) + Math.abs(emptyY - pieceY) === 1;
        });
        
        if (adjacentPieces.length > 0) {
            // Randomly select one adjacent piece and move it
            const randomPiece = adjacentPieces[Math.floor(Math.random() * adjacentPieces.length)];
            movePiece(randomPiece, 0, 0);
        }
    }
    
    document.getElementById('message').innerText = '!Solve It!';
}
