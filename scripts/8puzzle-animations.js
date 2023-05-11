/* ------------------ Setting Animasi Puzzle ------------------ */
// Animasi ketika goal state tercapai
function puzzleCompleted() {
    hideButtons();

    // Menambahkan background khusus kondisi ketika goal state tercapai
    document.body.classList.add('background-completed');

    document.getElementById('grid').classList.add('completed');

    let buttons = document.getElementsByClassName('btn');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.add('completed');
    }

    let text = document.getElementsByClassName('title');
    text[0].textContent = 'Puzzle Selesai!';
    text[0].classList.add('title-completed');
}

// Reset animasi puzzle
function initializePuzzle() {
    resetButtons();

    document.body.classList.remove('background-completed');
    document.getElementById('grid').classList.remove('completed');

    let buttons = document.getElementsByClassName('btn');

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('completed');
    }

    let text = document.getElementsByClassName('title');
    text[0].textContent = '8-Puzzle Solver';
    text[0].classList.remove('title-completed');
}

// Sembunyikan Reset/Solve Buttons
function hideButtons() {
    let solveButton = document.getElementById('solve');
    let resetButton = document.getElementById('reset');
    let shuffleButton = document.getElementById('shuffle');
    let statsBtn = document.getElementById('stats');
    let solutionButton = document.getElementById('solution');

    solveButton.classList.add('remove');
    resetButton.classList.add('remove');
    statsBtn.classList.remove('remove');
    shuffleButton.classList.remove('remove');
    solutionButton.classList.remove('remove');
}

// Sembunyikan semua button
function hideAllButtons() {
    let buttons = document.getElementsByClassName('btn');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.add('fade-out');
    }

    // Tunggu 1 detik dan sembunyikan semua button
    setTimeout(function () {
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.add('remove');
            buttons[i].classList.remove('fade-out');
        }
    }, 100);
}

// Tunjukkan semua button
function showAllButtons() {
    let buttons = document.getElementsByClassName('btn');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.add('fade-in');
    }

    // Tunggu 1 Detik dan sembunyikan button
    setTimeout(function () {
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('fade-in');
        }
    }, 500);
}

// Reset Default Buttons
function resetButtons() {
    let solveButton = document.getElementById('solve');
    let resetButton = document.getElementById('reset');
    let solutionButton = document.getElementById('solution');
    let statsBtn = document.getElementById('stats');

    solveButton.classList.remove('remove');
    resetButton.classList.remove('remove');
    statsBtn.classList.add('remove');
    solutionButton.classList.add('remove');
    showAllButtons();
}

// Button untuk membuka pdf terkait penjelasan aplikasi
function openPDF() {
    window.open('Penjelasan 8-Puzzle Solver Game.pdf', '_blank');
}

// Kondisi Button ketika Puzzle complete
function toggleCompleted() {
    if (document.getElementById('grid').classList.contains('completed')) {
        initializePuzzle();
    } else {
        puzzleCompleted();
    }
}

// Menunjukkan elemen tile terdekat
async function displayAdjacentElements(time) {
    var gridArray = getCurrentGrid();
    let adjacentElements = getAdjacentElementsHtml(gridArray);

    // Menambahkan ajacent classes ke dalam tiles
    for (let i = 0; i < adjacentElements.length; i++) {
        let element = document.getElementById(`${adjacentElements[i]}`);
        element.classList.add('adjacent');
    }

    // Tunggu selama 700ms dan remove the classes
    await new Promise((resolve) => setTimeout(resolve, time));
    for (let i = 0; i < adjacentElements.length; i++) {
        let element = document.getElementById(`${adjacentElements[i]}`);
        element.classList.remove('adjacent');
    }
}

async function highlightMovedTile(grid1, grid2) {
    // Mendapatkan elemen dari tile yang pindah
    let movedTile = findMovedElement(grid1, grid2);

    // Mendapatkan elemen pada tile
    let tile = document.getElementById(`${movedTile}`);
    tile.classList.add('adjacent');

    // menunggu sekitar 350 ms and remove setiap class
    setTimeout(function () {
        tile.classList.remove('adjacent');
    }, 350);
}

/*---- Kumpulan fungsi untuk menampilkan animasi jika goal state pertama kali dicapai ----*/
async function displaySolution(solutionArr, index) {
    // Menyimpan grid ke dalam variabel
    let currentGrid = convertToStringArray(solutionArr[index]);
    let previousGrid = [];

    if (index > 0) previousGrid = convertToStringArray(solutionArr[index - 1]);

    // Highlighting the tiles that are different
    if (index > 0) await highlightMovedTile(currentGrid, previousGrid);
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Drawing the grid
    drawGrid(currentGrid);

    if (index > 0) await highlightMovedTile(currentGrid, previousGrid);
    if (index < solutionArr.length - 1) await new Promise((resolve) => setTimeout(resolve, 150));
    await new Promise((resolve) => setTimeout(resolve, 300));
}

function addElementToStatsBox(content, isAppend) {
    let element = document.createElement('p');
    element.textContent = content;
    element.classList.add('stats-text');
    let boxElements = document.getElementsByClassName('stats-box');
    if (isAppend) boxElements[0].appendChild(element);
    else boxElements[0].prepend(element);
}

function updateStatsBox(stats) {
    console.log(stats);

    // Create a new element for each stat
    for (let i = 0; i < stats.length; i++) {
        addElementToStatsBox(stats[i], true);
    }
}

function clearStatsBox() {
    let boxElements = document.getElementsByClassName('stats-box');

    // Remove all elements from the stats box except the first 2
    while (boxElements[0].children.length > 1) {
        boxElements[0].removeChild(boxElements[0].lastChild);
    }
}

let modal = document.getElementById('container-box');


function openStatsModal() {
    modal.style.removeProperty('display');
}

function closeStatsModal() {
    modal.style.display = 'none';
}

modal.addEventListener('click', function () {
    closeStatsModal();
});