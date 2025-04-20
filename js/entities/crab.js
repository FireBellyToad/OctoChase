class Crab extends Entity {
    #gameMapRef;

    constructor(gameMap) {
        super("🦀");
        this.#gameMapRef = gameMap;
    }

    init() {

        if (!this.#gameMapRef) {
            throw new Error("gameMapRef is not initialized!")
        }

        //Start at first available cell
        const crabStartPos = this.#gameMapRef.freeCells.pop();
        this.x = crabStartPos.x;
        this.y = crabStartPos.y;
    }

    async act() {

        //Wander casually
        let diff, newX, newY;
        do{
            diff = {
                x: Math.ceil(ROT.RNG.getUniform() * 3) - 2,
                y: Math.ceil(ROT.RNG.getUniform() * 3) - 2,
            }

            //Keep within map boundaries
            newX = ROT.Util.clamp(this.x + diff.x,1,displayOptions.width -1);
            newY = ROT.Util.clamp(this.y + diff.y,1,displayOptions.height -1);

            //Retry until destination is on passable tile
        }while(!this.#gameMapRef.isPassable(newX, newY))
            
        //move
        this.x = newX;
        this.y = newY;
   
    }
}