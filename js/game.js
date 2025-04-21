//Game main object
const Game = {
    display: null,
    gameMap: null,
    player: null,
    crab: null,
    shark: null,
    actors: [],
    scheduler: new ROT.Scheduler.Speed(), //Keeps in mind entity speed

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
        this.actors.push(this.player);
        this.actors.push(this.crab);
        this.actors.push(this.shark);

        this.gameMap.generateMap();
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
                await this.endGame("🏆 You ate the crab! 🏆", "blue");
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
        for (let x = 0; x < displayOptions.width; x++) {
            for (let y = 0; y < displayOptions.height; y++) {
                this.display.draw(x, y, this.gameMap.map[x][y]);
            }
        }
        
        this.actors.forEach(a => this.display.draw(a.x, a.y, a.icon));
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
