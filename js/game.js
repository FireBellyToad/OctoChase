//Game main object
const Game = {
    display: null,

    // Init main fuction
    init: function() {
        //Creates a Display, a canvas object that draws the games graphic
        this.display = new ROT.Display(displayOptions);
        document.body.appendChild(this.display.getContainer());

        gameMap.generateMap();
        this.render();
    },
    
    // Draw map
    render: function () {
        for (const key in gameMap.map) {
            const parts = key.split(",");
            const x = parseInt(parts[0]);
            const y = parseInt(parts[1]);
            this.display.draw(x, y, gameMap.map[key]);
        }
    }
}
