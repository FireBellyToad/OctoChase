//Game main object
const Game = {
    display: null,

    // Init main fuction
    init: function() {
        //Creates a Display, a canvas object that draws the games graphic
        this.display = new ROT.Display(displayOptions);
        document.body.appendChild(this.display.getContainer());

        gameMap.generateMap();
        player.init();        
        this.render();
    },
    
    // Draw map
    render: function () {
        for (let x = 0; x < displayOptions.width; x++) {
            for (let y = 0; y < displayOptions.height; y++) {
                this.display.draw(x, y, gameMap.map[x][y]);
            }
        }
        this.display.draw(player.x, player.y, player.icon);
    }
}
