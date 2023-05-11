/* ------------------ Leaf Nodes Class ------------------ */
class Leaf {
    constructor(state, depth, parent) {
        this.state = state;
        this.depth = depth;
        this.cost = heuristicCost(this.state);
        this.total_cost = this.depth + this.cost;
        this.parent = parent;
    }
}

/* ------------------ Decision Tree Untuk Algoritma A* ------------------ */
class DecisionTree {
    // Decision Tree Constructor
    constructor(state) {
        this.root = new Leaf(state, 0, null);
        this.depth = 0;
        this.explored = [];
        this.toExplore = [this.root];
        this.maxCost = 0;
        this.createdLeaves = 0;
        this.moves = 0;
    }

    // Decision Tree Destructor
    destroy() {
        this.root = null;
        this.depth = null;
        this.explored = null;
        this.toExplore = null;
        this.maxCost = null;
        this.exploredStates = null;
        this.moves = null;
    }

    // Temukan leaf dengan cost terendah dan lepaskan leaf tersebut dari toExplore array
    async findBestLeaf() {
        let currentLeaf = this.toExplore[0];
        let leafIndex = 0;

        this.toExplore.forEach((leaf, index) => {
            if (leaf.total_cost < currentLeaf.total_cost) {
                currentLeaf = leaf;
                leafIndex = index;
            }
        });

        this.toExplore.splice(leafIndex, 1);
        this.explored.push(currentLeaf);

        return currentLeaf;
    }

    // Mendapatkan elemen terdekat dari tile yang kosong
    getAdjacentElements(gridArray) {
        var adjacentElements = [];
        var emptyTileIndex = gridArray.indexOf(0);

        // Elemen Bagian atas
        if (emptyTileIndex - 3 >= 0) adjacentElements.push(gridArray[emptyTileIndex - 3]);
        // Elemen Bagian bawah
        if (emptyTileIndex + 3 <= 8) adjacentElements.push(gridArray[emptyTileIndex + 3]);
        // Elemen Bagian kiri
        if (emptyTileIndex - 1 >= 0 && emptyTileIndex % 3 != 0) adjacentElements.push(gridArray[emptyTileIndex - 1]);
        // Elemen Bagian kanan
        if (emptyTileIndex + 1 <= 8 && emptyTileIndex % 3 != 2) adjacentElements.push(gridArray[emptyTileIndex + 1]);

        return adjacentElements;
    }

    // Genereta state untuk langkah selanjutnya yang lebih dalam
    generateNextDepthStates(leaf) {
        const possibleStates = [];
        const state = leaf.state;

        const emptyTileIndex = state.indexOf(0);
        const adjacentElements = this.getAdjacentElements(state);

        for (let i = 0; i < adjacentElements.length; i++) {
            const adjacentElementIndex = state.indexOf(adjacentElements[i]);
            const newState = state.slice();

            newState[emptyTileIndex] = adjacentElements[i];
            newState[adjacentElementIndex] = 0;

            possibleStates.push(new Leaf(newState, leaf.depth + 1, leaf));
            this.createdLeaves++;
        }

        return possibleStates;
    }

    // Implementasi Algoritma A* pada Decision Tree
    async aStarSearch(animate) {
        let timeRunning = new Date();
        let timeStart = new Date();

        while (this.toExplore.length > 0) {
            let currentLeaf = await this.findBestLeaf();

            /*==== visualisasi tampilan antarmuka ===*/
            // Untuk setiap 50 ms waktu berlalu, update the tampilan antarmuka
            if (animate && new Date() - timeRunning > 25) {
                // Update the UI
                drawGrid(currentLeaf.state);
                await displayAdjacentElements(1);
                timeRunning = new Date();
            }

            // Periksa apakah leaf yang sekarang sudah ada pada kondisi goal state
            if (isSolved(currentLeaf.state)) {
                // Reverse solusi yang telah ditemukan
                let solution = reverseSolutionPath(currentLeaf);
                drawGrid(currentLeaf.state);

                /*==== Tampilan Antarmuka untuk Statistik Penyelesaian Puzzle ===*/
                let stats = [
                    `Waktu Penyelesaian: ${new Date() - timeStart} ms`,
                    `States Tereksplor: ${this.explored.length}`,
                    `Leaf Tercipta: ${this.createdLeaves}`,
                    `Gerak Optimal: ${this.moves}`,
                    `Cost Maksimal: ${this.maxCost}`,
                ];
                updateStatsBox(stats);
                return solution;
            }

            let leaves = this.generateNextDepthStates(currentLeaf);

            // Tambahkan leaf baru ke toExplore array
            for (let leaf of leaves) {
                let isExplored = false;
                this.explored.forEach((exploredLeaf) => {
                    if (leaf.state.toString() === exploredLeaf.state.toString()) {
                        isExplored = true;
                    }
                });
                if (isExplored) continue;

                let notExplored = true;
                this.toExplore.forEach((toExploreLeaf) => {
                    if (leaf.state.toString() === toExploreLeaf.state.toString()) {
                        notExplored = false;
                    }
                });
                if (notExplored) this.toExplore.push(leaf);

                logCurrentLeaf(leaf);

                if (leaf.depth > this.moves) this.moves = leaf.depth;
                if (leaf.total_cost > this.maxCost) this.maxCost = leaf.total_cost;
            }
        }
    }

    // Tampilkan state yang telah dieksplor berdasarkan kedalaman state di Terminal
    printTree() {
        let depth = 0;

        // Sortir state yang telah dieksplor berdasarkan tingkat kedalamannya
        this.explored.sort((a, b) => {
            return a.depth - b.depth;
        });

        console.log(`---------------------- Root ----------------------`);
        for (let leaf of this.explored) {
            // Gambar garis antar state dengan kedalaman berbeda
            if (leaf.depth > depth) {
                console.log(`--------------------- Level ${depth + 1} ---------------------`);
                depth++;
            }
            console.log(leaf.state);
        }
    }
}
