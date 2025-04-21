// Generic class entity
class Entity {

    x;
    y;
    #icon = "⚠️";

    constructor(icon) {
        this.#icon = icon;
    }

    init(gameMap) {
        throw new Error("Unimplemented method init");
    }

    async act() {
        throw new Error("Unimplemented method act");
    }

    getSpeed() {
        throw new Error("Unimplemented method getSpeed");
    }

    get icon() {
        return this.#icon;
    }
}