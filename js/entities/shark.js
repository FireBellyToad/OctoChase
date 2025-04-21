class Shark extends Entity {
    #gameMapRef;
    #playerRef;
    #killedPlayer = false;

    constructor(gameMap, player) {
        super("🦈");
        this.#gameMapRef = gameMap;
        this.#playerRef = player;
    }

    init() {

        if (!this.#gameMapRef) {
            throw new Error("gameMapRef is not initialized!")
        }
        if (!this.#playerRef) {
            throw new Error("playerRef is not initialized!")
        }

        //Start at first available cell in the middle
        let newX = Math.ceil((displayOptions.width - 1) / 2);
        let newY = Math.ceil((displayOptions.height - 1) / 2);

        let diff
        //Try until starting position is on passable tile
        while (!this.#gameMapRef.isPassable(newX, newY)) {
            diff = {
                x: Math.ceil(ROT.RNG.getUniform() * 3) - 2,
                y: Math.ceil(ROT.RNG.getUniform() * 3) - 2,
            }

            //Keep within map boundaries
            newX = ROT.Util.clamp(newX + diff.x, 1, displayOptions.width - 1);
            newY = ROT.Util.clamp(newY + diff.y, 1, displayOptions.height - 1);

        }

        //Set position
        this.x = newX
        this.y = newY
        this.#killedPlayer = false;
    }

    async act() {

        //A* Pathfinder towards the player 
        let destX = this.#playerRef.x;
        let destY = this.#playerRef.y;

        //Check if passable and then search path
        const astar = new ROT.Path.AStar(destX, destY, (x, y) => {
            return this.#gameMapRef.isPassable(x, y)
        }, { topology: 4 });

        const path = [];
        astar.compute(this.x, this.y, (x, y) => path.push([x, y]));

        //Remove first node (shark position)
        path.shift();
        if (path.length < 2) {
            //Kill player!
            this.#killedPlayer = true;
        } else {
            //Move to next node
            destX = path[0][0];
            destY = path[0][1];
            this.x = destX;
            this.y = destY;
        }

    }

    get hasKilledPlayer() {
        return this.#killedPlayer;
    }
    
    getSpeed() {
        return 2;
    }
}