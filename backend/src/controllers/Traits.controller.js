// combines functions for responding on http request for traits logic (get all traits name, get values for one trait)
import { Images, Traits, ImageTraits, sequelize } from "../models/index.js";
import { Transaction, Sequelize } from "sequelize";

class TraitsController {
    async GetTraits(req, res, next) {
        console.log("GetTraits");
        try {
            const traits = await Traits.findAll({
                attributes: ["id", "name"],
                include: {
                    attributes: [],
                    model: ImageTraits,
                    required: true,
                },
            });
            res.json(traits);
        } catch {
            next(new Error("DB read error"));
        }
    }

    async GetTraitValues(req, res, next) {
        try {
            const id = +req.params.id;

            const traitValues = await ImageTraits.findAll({
                where: {
                    TraitId: id,
                },
                attributes: [
                    [Sequelize.fn("DISTINCT", Sequelize.col("value")), "value"],
                ],
            });
            res.json(traitValues);
        } catch {
            next(new Error("DB read error"));
        }
    }
}

export default new TraitsController();
