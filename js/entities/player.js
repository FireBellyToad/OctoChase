class Player extends Entity {

    #keyCode = [];
    #gameMapRef;

    constructor(gameMap) {
        super("🐙");
        this.#gameMapRef = gameMap;
    }

    init() {

        if(!this.#gameMapRef){
            throw new Error("gameMapRef is not initialized!")
        } 
        
        //Start at first available cell
        const playerStartPos = this.#gameMapRef.freeCells[0];
        this.x = playerStartPos.x;
        this.y = playerStartPos.y;
        
        //Arrows
        this.#keyCode[38] = 0; // key-up
        this.#keyCode[39] = 2; // key-right
        this.#keyCode[40] = 4; // key-down
        this.#keyCode[37] = 6; // key-left
    }

    async act() {

        // This halts the whole game player did something input
        let action = false;
        while (!action) {
            
            //Slow down the game a little
            await new Promise((resolve) => setTimeout(resolve, 50));

            let e = await new Promise((resolve) => {
                window.addEventListener("keydown", resolve, { once: true });
            });
            action = this.handleInput(e);
        }

    }

    handleInput(e) {
        const code = e.keyCode;

        if (!(code in this.#keyCode)) {
            //Unsupported key
            return false;
        }

        // ROT.DIRS is needed to map the movement direction within the game map
        // diff is the topological diffs. So we can handle "collisions"
        const diff = ROT.DIRS[8][this.#keyCode[code]];
        if (this.#gameMapRef.isPassable(this.x + diff[0], this.y + diff[1])) {
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