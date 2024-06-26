document.addEventListener('DOMContentLoaded', () => {
    // Prevent arrow key scrolling
    document.addEventListener('keydown', function(event) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
        }
    });
    
    const gridContainer = document.querySelector('.grid-container');
    const scoreDisplay = document.querySelector('.score span');
    const highScoreDisplay = document.querySelector('.high-score span');
    let tiles = [];
    let score = 0;
    let highScore = parseInt(localStorage.getItem('highScore')) || 0;
    highScoreDisplay.innerHTML = highScore;

    function updateScore(newScore) {
        score = newScore;
        scoreDisplay.innerHTML = score;
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.innerHTML = highScore;
            localStorage.setItem('highScore', highScore);
        }
    }

    function init() {
        for (let i = 0; i < 16; i++) {
            let tile = document.createElement('div');
            tile.className = 'grid-cell';
            tile.innerHTML = '';
            gridContainer.appendChild(tile);
            tiles.push(tile);
        }
        addNumber();
        addNumber();
    }

    function addNumber() {
        let emptyTiles = tiles.filter(tile => tile.innerHTML === '');
        if (emptyTiles.length > 0) {
            let tile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            tile.innerHTML = Math.random() > 0.5 ? 2 : 4;
            tile.style.backgroundColor = getColor(tile.innerHTML);
        }
    }

    function getColor(value) {
        const colorMap = {
            '2': '#eee4da',
            '4': '#ede0c8',
            '8': '#f2b179',
            '16': '#f59563',
            '32': '#f67c5f',
            '64': '#f65e3b',
            '128': '#edcf72',
            '256': '#edcc61',
            '512': '#edc850',
            '1024': '#edc53f',
            '2048': '#edc22e',
            '4096': '#3c3a32',
            '8192': '#3c3a33',
            '16384': '#3c3a34',
            '32768': '#3c3a35',
            '65536': '#3c3a36',
            '131072': '#3c3a37'
        };
        return colorMap[value] || '#cdc1b4';
    }

    function move(direction) {
        if (slideTiles(direction)) {
            addNumber();
            updateScore(score);
            checkGameOver();
        }
    }

    function slideTiles(direction) {
        let oldGrid = tiles.map(tile => tile.innerHTML);
        for (let i = 0; i < 4; i++) {
            let row = [];
            for (let j = 0; j < 4; j++) {
                if (direction === 'up' || direction === 'down') {
                    row.push(tiles[j * 4 + i].innerHTML);
                } else {
                    row.push(tiles[i * 4 + j].innerHTML);
                }
            }
            row = filterRow(row);
            if (direction === 'up' || direction === 'left') {
                row = combineRow(row);
                row = filterRow(row);
                row = row.concat(Array(4 - row.length).fill(''));
            } else {
                row = combineRow(row.reverse()).reverse();
                row = filterRow(row);
                row = Array(4 - row.length).fill('').concat(row);
            }
            for (let j = 0; j < 4; j++) {
                if (direction === 'up' || direction === 'down') {
                    tiles[j * 4 + i].innerHTML = row[j];
                    tiles[j * 4 + i].style.backgroundColor = getColor(row[j]);
                } else {
                    tiles[i * 4 + j].innerHTML = row[j];
                    tiles[i * 4 + j].style.backgroundColor = getColor(row[j]);
                }
                let fontSizeID = getFontSizeID(row[j]);
                tiles[j * 4 + i].setAttribute('data-font-size-id', fontSizeID);
            }
        }
        return oldGrid.some((val, idx) => val !== tiles[idx].innerHTML);
    }
    
    function getFontSizeID(value) {
        if (value.length <= 2) {
            return 'small-font';
        } else if (value.length === 3) {
            return 'medium-font';
        } else if (value.length === 4) {
            return 'large-font';
        } else {
            return 'default-font';
        }
    }
    
    
    function filterRow(row) {
        return row.filter(val => val !== '');
    }

    function combineRow(row) {
        for (let i = 0; i < row.length - 1; i++) {
            if (row[i] === row[i + 1] && row[i] !== '') {
                row[i] = (parseInt(row[i]) * 2).toString();
                row[i + 1] = '';
                score += parseInt(row[i]);
                scoreDisplay.innerHTML = score;
                if (row[i] === '2048') {
                    alert('You win!');
                }
            }
        }
        return row;
    }

    function checkGameOver() {
        if (!tiles.filter(tile => tile.innerHTML === '').length && !canCombine()) {
            alert('Game Over! Try again.');
        }
    }

    function canCombine() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let tile = parseInt(tiles[i * 4 + j].innerHTML);
                if (j !== 3 && tile === parseInt(tiles[i * 4 + j + 1].innerHTML)) return true;
                if (i !== 3 && tile === parseInt(tiles[(i + 1) * 4 + j].innerHTML)) return true;
            }
        }
        return false;
    }

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp') move('up');
        if (e.key === 'ArrowDown') move('down');
        if (e.key === 'ArrowLeft') move('left');
        if (e.key === 'ArrowRight') move('right');
    });

    init();
});

document.getElementById('reset-button').addEventListener('click', function() {
    location.reload();
})