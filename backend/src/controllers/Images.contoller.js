// combines functions for responding on http request for image logic (add new img, get with filters, get random)
import { Images, Traits, ImageTraits, sequelize } from "../models/index.js";
import { Transaction, QueryTypes } from "sequelize";
import IPFSSerice from "../services/Ipfs.service.js";
import IpfsService from "../services/Ipfs.service.js";

const PASSWORD = process.env.PASSWORD;

class ImagesController {
    constructor() {
        this.GetImage = this.GetImage.bind(this);
        this.GetRandomImage = this.GetRandomImage.bind(this);
        this.SendImage = this.SendImage.bind(this);
    }

    async GetImage(req, res, next) {
        const body = req.body;
        const filters = body.filters.map((el) => el.trait_type + " " + el.value);

        const images = await sequelize.query(
            `Select * from "Images"
        Where "Images"."isFrozen"=false AND  "Images".id IN(
        SELECT "ImageTraits"."ImageId"  from "ImageTraits"
        LEFT JOIN "Traits" on "Traits".id="ImageTraits"."TraitId"
        WHERE "Traits".name ||' '||"ImageTraits".value IN (:array)
        GROUP BY "ImageTraits"."ImageId"
        HAVING (COUNT("ImageTraits"."ImageId")) =:count)
        ORDER BY random()
        LIMIT 1 `, {
            replacements: {
                count: filters.length,
                array: filters,
            },
            model: Images,
            type: QueryTypes.SELECT,
        }
        );
        this.SendImage(images, res, next);
    }

    async GetRandomImage(req, res, next) {
        const images = await sequelize.query(
            `Select *  from "Images"
            WHERE "Images"."isFrozen"=false
        ORDER BY random()
        LIMIT 1 `, {
            type: QueryTypes.SELECT,
            model: Images,
        }
        );
        this.SendImage(images, res, next);
    }

    async SendImage(images, res, next) {
        try {
            if (images[0] && images[0].id) {
                await Images.update({ isFrozen: true }, {
                    where: {
                        id: images[0].id,
                    },
                });

                res.send({ path: images[0].ipfs });
                return;
            }

            next(new Error("There is no such image"));
        } catch (err) {
            console.log(err);
            next(new Error("Couldnt delete"));
        }
    }

    async UndoImageFroze(req, res, next) {
        const { imageIpfs } = req.body;
        const image = await Images.findOne({
            where: {
                ipfs: imageIpfs,
            },
        });
        if (image) {
            image.isFrozen = false;
            await image.save();
            res.json({ successful: true });
        } else {
            res.json({ Error: "No such image" });
        }
    }

    async FullDeleteImage(req, res, next) {
        const { imageIpfs } = req.body;
        const image = await Images.findOne({
            where: {
                ipfs: imageIpfs,
            },
        });
        if (image) {
            await image.destroy();
            res.json({ successful: true });
        } else {
            res.json({ Error: "No such image" });
        }
    }

    async AddImage(req, res, next) {
        const body = req.body;

        if (body.password !== PASSWORD) {
            next(new Error("Password is incorrect."));
            return;
        }

        const { name, image: imageUrl, description, attributes } = body;

        if (!(name && imageUrl && description)) {
            //error in data
            next(new Error("Incorrect Data"));
            return;
        }
        //if there will be any error the image wont be added
        const t = await sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
        });
        try {
            const ipfs = await IpfsService.ipfsUpload({
                name: name,
                description: description,
                image: imageUrl,
                attributes: attributes,
            });

            const image = await Images.create({ name, url: imageUrl, description, ipfs: ipfs.path }, { transaction: t });
            console.log(attributes);
            await Promise.all(
                attributes.map(async ({ trait_type, value }) => {
                    const [trait, isCreated] = await Traits.findOrCreate({
                        where: { name: trait_type },
                        defaults: {
                            name: trait_type,
                        },
                        transaction: t,
                    });
                    await ImageTraits.create({
                        ImageId: image.id,
                        TraitId: trait.id,
                        value,
                    }, { transaction: t });
                })
            );
            await t.commit();
            res.json({ successful: true });
            return;
        } catch (err) {
            console.log(err);
            await t.rollback();
            next(new Error("Check to see if data is unique."));
            return;
        }
    }
}

export default new ImagesController();
