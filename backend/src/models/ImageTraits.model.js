// Inits Model for database
import { Sequelize, DataTypes, Model } from "sequelize";
import sequelize from "./sequalize.js";
import Image from "./Image.model.js";
import Trait from "./Trait.model.js";

class ImageTraits extends Model {}

ImageTraits.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ImageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Image,
            key: "id",
        },
    },
    TraitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Trait,
            key: "id",
        },
    },
    value: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: "ImageTraits",
    timestamps: false,
});

export default ImageTraits;