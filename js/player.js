const player = {
    
    //Position in map
    x:null,
    y:null,

    icon: "🐙",

    init: function(){
        //Start at first available cell
        const playerStartPos = gameMap.freeCells[0];
        this.x = playerStartPos.x;
        this.y = playerStartPos.y;
    }
}