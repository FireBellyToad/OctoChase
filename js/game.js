//Game main object
const Game = {
    display: null,

    // Init main fuction
    init: function () {
        //Creates a Display, a canvas object that draws the games graphic
        this.display = new ROT.Display(displayOptions);
        document.body.appendChild(this.display.getContainer());

        gameMap.generateMap();
        player.init();
        crab.init();
        this.engine(); // start the game engine
        this.render();
    },

    //Game loop
    engine: async function () {
        // this is responsible of watching the player move and updating
        // the display accordingly. It is all we need as engine
        while (true) {
          await player.act(); 
          this.render();
        }
      },

    // Draw map
    render: function () {
        for (let x = 0; x < displayOptions.width; x++) {
            for (let y = 0; y < displayOptions.height; y++) {
                this.display.draw(x, y, gameMap.map[x][y]);
            }
        }
        this.display.draw(player.x, player.y, player.icon);
        this.display.draw(crab.x, crab.y, crab.icon);
    },

    // when the game is over, we clear hte screen and show a fancy message
    endGame: function () {
        this.win = true;
        this.display.clear();
        this.display.draw(8, 8, "You ate the crab!", "blue");
        // gameMap.generateMap();
        player.init();
        // crab.init();
    }
}
