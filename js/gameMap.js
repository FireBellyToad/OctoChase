class GameMap {

    #map;
    #freeCells;
    #digger;

    generateMap() {

        //Create new map from scratch
        this.#map = [];
        this.#freeCells = [];

        // create the walls around the map
        for (let x = 0; x < displayOptions.width; x++) {
            this.#map[x] = [];
            for (let y = 0; y < displayOptions.height; y++) {
                this.#map[x][y] = new Tile("🌑");
            }
        }

        //Create a cellular map (cavelike) with space for borders
        this.digger = new ROT.Map.Cellular(
            displayOptions.width - 2,
            displayOptions.height - 2
        );
        this.digger.randomize(0.4);

        //Custom Room generator callback
        this.digger.create((x, y, value) => {

            if (value !== 1) {
                //Record all free cells
                this.#map[x + 1][y + 1] = new Tile(".");
                this.#freeCells.push({ x: x + 1, y: y + 1 })
            } else {
                //Draw rock emoji
                //shifts all tiles +1 in bot coords because we need to keep the border
                this.#map[x + 1][y + 1] = new Tile("🌑");
            }

        });

    }

    isPassable(x, y) {
        return this.#map[x][y].icon !== "🌑"
    }

    get map() {
        return this.#map;
    }

    get freeCells() {
        return this.#freeCells;
    }
}