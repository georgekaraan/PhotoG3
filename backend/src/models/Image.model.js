// Inits Model for database
import { Sequelize, DataTypes, Model } from "sequelize";
import sequelize from "./sequalize.js";

class Image extends Model {}

Image.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    sequelize,
    modelName: "Image",
    timestamps: false,
});

export default Image;