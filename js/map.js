const gameMap = {

    map: [],
    freeCells: [],
    generateMap: function () {

        // create the walls around the map
        for (let x = 0; x < displayOptions.width; x++) {
            for (let y = 0; y < displayOptions.height; y++) {
                this.map[x + "," + y] = "🌑";
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
            //shifts all tiles +1 in bot coords because we need to keep the border
            const key = (x + 1) + "," + (y + 1);

            //record all free cells
            if (value !== 1) {
                this.freeCells.push(key)
            }

            //Draw rock emoji
            this.map[key] = value === 1 ? "🌑" : ".";
        });
    },
}