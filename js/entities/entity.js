// Generic class entity
class Entity {

    x;
    y;
    #icon = "⚠️";

    constructor(icon) {
        this.#icon = icon;
    }

    act() {
        throw new Error("Unimplemented method act");
    }

    get icon() {
        return this.#icon;
    }
}