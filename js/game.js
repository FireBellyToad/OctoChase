//Game main object
const Game = {
    display: null,
    gameMap: null,
    player: null,
    crab: null,
    scheduler: new ROT.Scheduler.Simple(),

    // Init main fuction
    init: function () {
        //Creates a Display, a canvas object that draws the games graphic
        this.display = new ROT.Display(displayOptions);
        document.body.appendChild(this.display.getContainer());

        this.gameMap = new GameMap();
        this.player = new Player(this.gameMap);
        this.crab = new Crab(this.gameMap);

        this.gameMap.generateMap();
        this.player.init(this.gameMap);
        this.crab.init(this.gameMap);
        this.engine(); // start the game engine
        this.render();
    },

    //Game loop
    engine: async function () {

        //Add to scheduler all the entities
        this.scheduler.add(this.player,true);
        this.scheduler.add(this.crab,true);

        // this is responsible of watching the player move and updating
        // the display accordingly. It is all we need as engine
        while (true) {
            
          await this.scheduler.next().act(); 

            //Await a valid movement
            // if crab is reached, create new map
            if (this.crab.x === this.player.x && this.crab.y === this.player.y) {
                this.endGame();
            }

          this.render();
        }
      },

    // Draw map
    render: function () {
        for (let x = 0; x < displayOptions.width; x++) {
            for (let y = 0; y < displayOptions.height; y++) {
                this.display.draw(x, y, this.gameMap.map[x][y]);
            }
        }
        this.display.draw(this.player.x, this.player.y, this.player.icon);
        this.display.draw(this.crab.x, this.crab.y, this.crab.icon);
    },

    // when the game is over, we clear hte screen and show a fancy message
    endGame: async function () {
        this.display.clear();
        this.display.draw(8, 8, "You ate the crab!", "blue");
        this.gameMap.generateMap();
        this.player.init();
        this.crab.init();
    }
}
