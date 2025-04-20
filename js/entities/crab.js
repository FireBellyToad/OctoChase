class Crab extends Entity {
    #gameMapRef;

    constructor(gameMap){
        super("🦀");
        this.#gameMapRef = gameMap;
    }

    init () {  

        if(!this.#gameMapRef){
            throw new Error("gameMapRef is not initialized!")
        } 
        
        //Start at first available cell
        const crabStartPos = this.#gameMapRef.freeCells.pop();
        this.x = crabStartPos.x;
        this.y = crabStartPos.y;
    }

    async act () {
    }
}