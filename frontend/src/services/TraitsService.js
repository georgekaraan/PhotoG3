import root from "./rootPath.js";

class TraitsService {
    async GetTraitsNames() {
        return fetch(root + "api/traits/").then((res) => res.json());
    }

    async GetTraitValues(id) {
        return fetch(root + "api/traits/" + id + "/").then((res) => res.json());
    }
}

export default new TraitsService();