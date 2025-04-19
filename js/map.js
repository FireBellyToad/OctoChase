const gameMap = {

    map: [],
    freeCells: [],
    generateMap: function () {

        // create the walls around the map
        for (let x = 0; x < displayOptions.width; x++) {
            this.map[x] = [];
            for (let y = 0; y < displayOptions.height; y++) {
                this.map[x][y] = "🌑";
            }
        }

        //Create a cellular map (cavelike) with space for borders
        const digger = new ROT.Map.Cellular(
            displayOptions.width - 2,
            displayOptions.height - 2
        );
        digger.randomize(0.4);

        //Custom Room generator callback
        digger.create((x, y, value) => {

            //record all free cells
            if (value !== 1) {
                this.freeCells.push({ x: x + 1, y: y + 1 })
            }

            //Draw rock emoji
            //shifts all tiles +1 in bot coords because we need to keep the border
            this.map[x + 1][y + 1] = value === 1 ? "🌑" : ".";
        });

    },

    isPassable: function(x,y){
        return this.map[x][y] !== "🌑"
    }
}