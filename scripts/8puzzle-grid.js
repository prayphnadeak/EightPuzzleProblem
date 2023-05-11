/* ------------------ Helper Functions ------------------ */
// Storing the solution in a global variable
let global_ai_solution = [];
let manual_moves = 0;


// Fungsi untuk shuffle elemen pada grid puzzle
function shuffleGridArray(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    // Saat masih ada element lain yang masih tersisa untuk di-shuffle...
    while (0 !== currentIndex) {
        // Ambil elemen yang tersisa tersebut...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // Dan tukarkan dengan elemen yang ada sekarang
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Konversi Int Array to String Array
function convertToStringArray(intArray) {
    let stringArray = [];
    for (let i = 0; i < intArray.length; i++) {
        stringArray.push(intArray[i].toString());
    }
    return stringArray;
}

// Konversi String Array To Int Array
function convertToIntArray(stringArray) {
    let intArray = [];
    for (let i = 0; i < stringArray.length; i++) {
        intArray.push(parseInt(stringArray[i]));
    }
    return intArray;
}

// Menemukan elemen yang telah berpindah di antara 2 grid
function findMovedElement(grid1, grid2) {
    let movedElement = 0;

    for (let i = 0; i < grid1.length; i++) {
        if (grid1[i] != grid2[i] && grid1[i] != 0) {
            movedElement = grid1[i];
        }
    }

    return movedElement;
}

// Menjalankan fungsi Puzzle saat Initial State
function startPuzzle() {
    initializePuzzle();
    addTileEventListeners();
}

// Menjalankan fungsi Puzzle saat Goal State
function completePuzzle() {
    puzzleCompleted();
    disableEvents();
}

/* ------------------ Fungsi untuk menggambarkan grid ------------------ */
// Gambar grid pada layar sesuai dengan array yang telah ditentukan
function drawGrid(defaultGrid) {
    for (var i = 0; i < defaultGrid.length; i++) {
        var tile = document.getElementById(defaultGrid[i]);
        var grid = document.getElementById('grid');
        grid.appendChild(tile);
    }
}

/* ------------------Fungsi Penolong dari Grid ------------------ */
function getCurrentGrid() {
    var gridElements = document
        .getElementById('grid')
        .getElementsByTagName('div');
        
    var gridArray = Array.from(gridElements);
    var newGrid = [];

    for (var i = 0; i < gridArray.length; i++) {
        newGrid.push(gridArray[i].innerHTML);
    }

    return newGrid;
}

// Grid Int Variation Int
function getCurrentGridInt() {
    let gridArray = getCurrentGrid();
    let intArray = convertToIntArray(gridArray);
    return intArray;
}

function isSolved(checkGrid) {
    var gridArray = checkGrid ? convertToStringArray(checkGrid) : getCurrentGrid();
    var solvedGrid = ['1', '2', '3', '4', '5', '6', '7', '8', '0'];

    for (var i = 0; i < gridArray.length; i++) {
        if (gridArray[i] != solvedGrid[i]) {
            return false;
        }
    }
    return true;
}


/* ------------------ Button untuk men-trigger terjadinya Event ------------------ */
//Trigger untuk reset grid pada puzzle
function resetGrid() {
    manual_moves = 0;
    var standardGrid = [5, 4, 1, 0, 2, 8, 3, 6, 7];
    startPuzzle();
    drawGrid(standardGrid);
}

//Trigger untuk shuffle grid pada puzzle
function shuffleGrid() {
    clearStatsBox();
    resetGrid();

    let newGrid = shuffleGridArray(getCurrentGrid());
    
    while(!isSolutionPossible(newGrid)) {
        shuffleGridArray(newGrid);
    }

    drawGrid(newGrid);
}

//Trigger untuk solve grid pada puzzle
async function solveGrid() {
    initializePuzzle();

    let grid = getCurrentGridInt();
  
    
    let isPossible = isSolutionPossible(grid);

    if (isPossible) {

        disableEvents();
        hideAllButtons();
        
        await new Promise(r => setTimeout(r, 100));
        let tree = new DecisionTree(grid);

        global_ai_solution = await tree.aStarSearch(true);
        
        if (isSolved()) { 
            completePuzzle()
            let statsBtn = document.getElementById('stats');
            let solutionBtn = document.getElementById('solution');
            solutionBtn.innerHTML = 'LIHAT SOLUSI';
            solutionBtn.disabled = false; 
        }
    } else {
        alert("This puzzle cannot be solved!");
    }
}

//Trigger untuk Show Solution pada puzzle
function showSolution() {
    let solutionBtn = document.getElementById('solution');

    if (global_ai_solution.length > 0) {
        initializePuzzle();
        hideAllButtons();
        printSolution(global_ai_solution);
        showAllButtons();
    } else {
        solutionBtn.innerHTML = 'Not Available';
        solutionBtn.disabled = true;
    }
}

/* ------------------ StartUp Call ------------------ */
startPuzzle();
