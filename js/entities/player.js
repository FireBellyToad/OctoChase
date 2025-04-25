class Player extends Entity {

    #keyCode;
    #gameMapRef;
    #restartLevel;

    constructor(gameMap) {
        super("🐙");
        this.#gameMapRef = gameMap;
        
        //Arrows
        this.#keyCode = [];
        this.#keyCode[38] = 0; // key-up
        this.#keyCode[39] = 2; // key-right
        this.#keyCode[40] = 4; // key-down
        this.#keyCode[37] = 6; // key-left
        this.#keyCode[82] = 'r'; // R key
        this.#keyCode[87] = 'w'; // W key
    }

    init() {

        if(!this.#gameMapRef){
            throw new Error("gameMapRef is not initialized!")
        } 
        
        //Start at first available cell
        const playerStartPos = this.#gameMapRef.freeCells[0];
        this.x = playerStartPos.x;
        this.y = playerStartPos.y;

        this.#restartLevel = false;
    }

    async act() {

        // This halts the whole game player did something input
        let action = false;
        while (!action) {
            
            //Slow down the game a little
            await new Promise((resolve) => setTimeout(resolve, 50));

            //Wait for keypress
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

        //Restart level 
        if(String.fromCharCode(code) === "R"){
            this.#restartLevel = true;
            return true;
        }

        //Wait doing nothing 
        if(String.fromCharCode(code) === "W"){
            return true;
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
    
    getSpeed() {
        return 2;
    }

    get restartLevel() {
        return this.#restartLevel;
    }
}