const player = {

    //Position in map
    x: null,
    y: null,

    icon: "🐙",
    keyCode: [],

    init: function () {
        //Start at first available cell
        const playerStartPos = gameMap.freeCells[0];
        this.x = playerStartPos.x;
        this.y = playerStartPos.y;

        //Arrows
        this.keyCode[38] = 0; // key-up
        this.keyCode[39] = 2; // key-right
        this.keyCode[40] = 4; // key-down
        this.keyCode[37] = 6; // key-left
    },

    act: async function () {

        // This halts the whole game until player input
        let action = false;
        while (!action) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          let e = await new Promise((resolve) => {
            window.addEventListener("keydown", resolve, { once: true });
          });
          action = this.handleInput(e);
        } 
        
        //Await a valid movement
        // if crab is reached, create new map
        if (crab.x === this.x && crab.y === this.y) {
          Game.endGame();
        }

    },

    handleInput: function (e) {
        const code = e.keyCode;

        if (!(code in this.keyCode)) {
            //Unsupported key
            return false;
        }

        // ROT.DIRS is needed to map the movement direction within the game map
        // diff is the topological diffs. So we can handle "collisions"
        const diff = ROT.DIRS[8][this.keyCode[code]];
        if (gameMap.isPassable(this.x + diff[0], this.y + diff[1])) {
            //move
            this.x += diff[0];
            this.y += diff[1];
            return true;
        } else {
            //stop and do nothing
            return false;
        }
    }
}