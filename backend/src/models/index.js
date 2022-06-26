// Create sql things between models
import Images from "./Image.model.js";
import Trait from "./Trait.model.js";
import ImageTraits from "./ImageTraits.model.js";
import sequelize from "./sequalize.js";

Images.belongsToMany(Trait, { through: ImageTraits });
Trait.belongsToMany(Images, { through: ImageTraits });
Trait.hasMany(ImageTraits);
ImageTraits.belongsTo(Trait);

Images.ToIPFSDTO = async function() {
    //returns image as in format given in dummy data
    const result = {
        name: this.name,
        description: this.description,
        image: this.url,
        attributes: [],
    };

    const traits = await ImageTraits.findAll({
        where: {
            ImageId: this.id,
        },
        include: Trait,
    });

    traits.forEach((imageTrait) => {
        result.attributes.push({
            trait_type: imageTrait.Trait.name,
            value: imageTrait.value,
        });
    });

    return result;
};
//initng all tables
sequelize.sync({ alter: true });
export { Images, Trait as Traits, ImageTraits, sequelize };