const crab = {
    x:null,
    y:null,

    icon: "🦀",
    
    init: function(){
        //Start at first available cell
        const crabStartPos = gameMap.freeCells.pop();
        this.x = crabStartPos.x;
        this.y = crabStartPos.y;
    }
}