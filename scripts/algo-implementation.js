
// Aturan Dasar:
// 1- Goal state dalam game ini didefinisikan sebagai:
//    1 2 3
//    4 5 6
//    7 8 0
// 2- Tile yang kosong hanya dapat dipindahkan ke berbagai tile terdekat di sekitar tile kosong
// 3- Tile yang berdekatan adalah tile yang secara horizontal atau vertikal berdekatan dengan tile kosong
// 4- Tile yang kosong tidak dapat bergerak diagonal untuk mencapai goal state


// Mendeteksi jumlah inversi
function isSolutionPossible(gridArray) {
    var inversions = 0;
    // Inversi akan dilakukan pada
    for (let i = 0; i < gridArray.length; i++) {
        for (let j = i + 1; j < gridArray.length; j++) {
            if (gridArray[i] != '0' && gridArray[j] != '0' && gridArray[i] > gridArray[j]) {
                inversions++;
            }
        }
    }

    // Jika jumlah inversi bernilai genap, maka masalah puzzle akan solvable
    if (inversions % 2 == 0) { return true; }
    return false;
}

// Formulasi dari Manhattan Distance
function ManhattanDistance(CurrentTileIndex, GoalStateTileIndex) {
    // Mendefinisikan absis dari Tile sebagai pembulatan ke bawah hasil CurrentTileIndex / 3
    let baris = [Math.floor(CurrentTileIndex / 3), Math.floor(GoalStateTileIndex / 3)]

    // Mendefinisikan oordinat dari Tile sebagai pembulatan ke bawah hasil CurrentTileIndex Mod 3
    let kolom = [CurrentTileIndex % 3, GoalStateTileIndex % 3];

    // Menghitung jarak absolut dari |baris0 - baris1| + |kolom0 - kolom1|
    return Math.abs(baris[0] - baris[1]) + Math.abs(kolom[0] - kolom[1]);
}

// Menghitung fungsi heuristik
function heuristicCost(state) {
    // Menetapkan Goal State 
        let goalState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    let cost = 0;
    // Pada setiap iterasi, jika tile saat ini bukan merupakan tile kosong (dengan nilai 0),
    // fungsi heuristicCost menghitung jarak Manhattan Distance antara tile tersebut dan posisi tile yang benar pada goal state
    // dengan menggunakan fungsi ManhattanDistance(CurrentTileIndex, GoalStateTileIndex) yang telah didefinisikan sebelumnya. 
    // Fungsi ini mengembalikan nilai jarak Manhattan Distance antara kedua tile.
    // nilai jarak Manhattan Distance tersebut ditambahkan ke variabel cost
    for (let i = 0; i < state.length; i++) {
        let tile = state[i];
        if (state[i] != 0) {
            let distance = ManhattanDistance(i, goalState.indexOf(tile));
            cost += distance;
        }
    }
    return cost;
}


function logCurrentLeaf(leaf) {
    console.log("Leaf: ", leaf.state, "\nDepth: ", leaf.depth, "Cost: ", leaf.cost);
}

// Reverse Solution Path
function reverseSolutionPath(solutionPath) {
    let reversedPath = [];
    let current = solutionPath;

    while (current != null) {
        reversedPath.push(current.state);
        current = current.parent;
    }

    return reversedPath.reverse();
}

// Tampilkan grid puzzle hasil
function printGrid(grid) {
    let gridString = '';
    for (let i = 0; i < grid.length; i++) {
        if (i % 3 === 0) {
            gridString += '[ ';
        }
        gridString += grid[i] + ' ';
        if (i % 3 === 2) {
            gridString += ']\n';
        }
    }
    return gridString;
}

// Tampilkan solusi
async function printSolution(solution) {
    console.log('Solution: \n');
    drawGrid(solution[0]);
    for (let i = 0; i < solution.length; i++) {
        console.log('Step ', i, ': \n' + printGrid(solution[i]));

        await displaySolution(solution, i);
    }
    puzzleCompleted();
    disableEvents();
}
