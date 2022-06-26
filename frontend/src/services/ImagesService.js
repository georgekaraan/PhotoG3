import root from "./rootPath.js";

class ImagesSerive {
    async GetImage(filters = []) {
        //if no filters
        if (!filters || filters.length == 0)
            return fetch(root + "api/images/getrandom/", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json());

        return fetch(root + "api/images/get/", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                filters,
            }),
        }).then((res) => res.json());
    }

    async AddImage({ name, description, image, attributes, password }) {
        return fetch(root + "api/images/", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
                image,
                attributes,
                password,
            }),
        }).then((res) => res.json());
    }
}

export default new ImagesSerive();