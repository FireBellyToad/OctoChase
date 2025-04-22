'use strict';
//Game main object
const Game = {
    display: null,
    gameMap: null,
    player: null,
    crab: null,
    shark: null,
    actors: null,
    scheduler: new ROT.Scheduler.Speed(), //Keeps in mind entity speed
    fov: null,

    // Init main fuction
    init: function () {
        //Creates a Display, a canvas object that draws the games graphic
        this.display = new ROT.Display(displayOptions);
        document.body.appendChild(this.display.getContainer());

        this.gameMap = new GameMap();
        this.player = new Player(this.gameMap);
        this.crab = new Crab(this.gameMap);
        this.shark = new Shark(this.gameMap, this.player);

        //Register actors
        this.actors = [];
        this.actors.push(this.player);
        this.actors.push(this.crab);
        this.actors.push(this.shark);

        this.gameMap.generateMap();
        
        //Get cell visibility (only free cells can be looked through)
        this.fov = new ROT.FOV.PreciseShadowcasting((x, y) => {
            return this.gameMap.freeCells.find( f => f.x === x && f.y === y)
        })
        
        this.actors.forEach(a => a.init(this.gameMap));
        this.engine(); // start the game engine
        this.render();

    },

    //Game loop
    engine: async function () {

        //Add to scheduler all the entities
        this.actors.forEach(a => this.scheduler.add(a, true));

        let currentActor

        // Main loop
        while (true) {

            //Await until the current actor has acted
            currentActor = this.scheduler.next();
            await currentActor.act();


            // Collision handling
            if (this.crab.x === this.player.x && this.crab.y === this.player.y) {
                await this.endGame("🏆 You ate the crab! 🏆", "white");
            } else if (this.shark.hasKilledPlayer) {
                await this.endGame("☠️ The shark ate you! ☠️", "red");
            }

            //Render only if currentActor is player
            if (currentActor instanceof Player) {
                this.render();
            }

        }
    },

    // Draw map and actors
    render: function () {

        this.display.clear();

        for (let x = 0; x < displayOptions.width; x++) {
            for (let y = 0; y < displayOptions.height; y++) {
                if (this.gameMap.map[x][y].unfogged) {
                    // Fog of war
                    this.display.draw(x, y, this.gameMap.map[x][y].icon, " #3c7f90", " #3c7f90");
                }
            }
        }

        //Draw only what the octopus can see
        this.fov.compute(this.player.x, this.player.y, 10, (x, y, r, visibility) => {
            this.gameMap.map[x][y].unfogged = true;
            this.display.draw(x, y, this.gameMap.map[x][y].icon, "dimGrey", "#76b5c5");
            this.actors.filter(a => a.x === x && a.y === y).forEach(a => this.display.draw(a.x, a.y, a.icon, "", "#76b5c5"));
        });
    },

    // when the game is over, we clear hte screen and show a fancy message for three seconds,
    // then starts a new game
    endGame: async function (message, color) {

        this.display.clear();
        this.display.draw(14, 10, message, color);

        await new Promise((resolve) => setTimeout(resolve, 3000));

        this.gameMap.generateMap();        
        this.actors.forEach(a => a.init(this.gameMap));
        this.render();
    }
}
