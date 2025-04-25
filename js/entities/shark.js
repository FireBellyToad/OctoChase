class Shark extends Entity {
    #gameMapRef;
    #playerRef;
    #lastPositionPlayerHasBeenSeen;

    // Field of View and Line of sight params
    #fov;
    #seenCounter;
    #SEEN_COUNTER_MAX = 10;
    #SIGHT_RADIUS = 15;

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
        this.#lastPositionPlayerHasBeenSeen = false;

        //Get cell visibility (only free cells can be looked through)
        this.#fov = new ROT.FOV.PreciseShadowcasting((x, y) => {
            return this.#gameMapRef.freeCells.find(f => f.x === x && f.y === y)
        })
    }

    async act() {

        //Shark can see octopus?
        this.#fov.compute(this.x, this.y, this.#SIGHT_RADIUS, (x, y, r, visibility) => {
            if ((this.#playerRef.x === x && this.#playerRef.y === y)) {
                //Everytime the shark has seen the octopus, will try to search it for a while
                //even if it doesn't see it anymore  
                this.#lastPositionPlayerHasBeenSeen = { x: x, y: y };
                this.#seenCounter = this.#SEEN_COUNTER_MAX;
            }
        });

        if (this.#lastPositionPlayerHasBeenSeen && this.#seenCounter > 0) {
            this.followPlayer();
            console.log("🦈 is following you! this.#seenCounter: ", this.#seenCounter )
        } else {
            this.wander();
            console.log("🦈 is wandering...")
        }

    }

    async wander() {

        // Remove last Position Player Has Been Seen
        if (this.#lastPositionPlayerHasBeenSeen)
            this.#lastPositionPlayerHasBeenSeen = null;

        //Wander casually
        let diff, newX, newY;
        do {
            diff = {
                x: Math.ceil(ROT.RNG.getUniform() * 3) - 2,
                y: Math.ceil(ROT.RNG.getUniform() * 3) - 2,
            }

            //Keep within map boundaries
            newX = ROT.Util.clamp(this.x + diff.x, 1, displayOptions.width - 1);
            newY = ROT.Util.clamp(this.y + diff.y, 1, displayOptions.height - 1);

            //Retry until destination is on passable tile
        } while (!this.#gameMapRef.isPassable(newX, newY))

        //move
        this.x = newX;
        this.y = newY;
    }

    async followPlayer() {

        //A* Pathfinder towards the player 
        let destX = this.#lastPositionPlayerHasBeenSeen.x;
        let destY = this.#lastPositionPlayerHasBeenSeen.y;

        //Check if passable and then search path
        const astar = new ROT.Path.AStar(destX, destY, (x, y) => {
            return this.#gameMapRef.isPassable(x, y)
        }, { topology: 4 });

        const path = [];
        astar.compute(this.x, this.y, (x, y) => path.push([x, y]));

        //Remove first node (shark position)
        path.shift();
        if (path[0] && path[0][0] && path[0][1])  {
            //Move to next node
            destX = path[0][0];
            destY = path[0][1];
        }
        this.x = destX;
        this.y = destY;

        // Reduce time which the shark will search the unseen octopus
        this.#seenCounter--
    }

    getSpeed() {
        return 2;
    }

    get distanceFromPlayer(){
        return Math.sqrt(Math.pow(this.x-this.#playerRef.x,2) + Math.pow(this.y-this.#playerRef.y,2));
    }
}