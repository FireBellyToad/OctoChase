class Tile {

    #icon;
    unfogged;

    constructor(icon) {
        this.#icon = icon;
        this.unfogged = false;
    }

    get icon() {
        return this.#icon;
    }

}