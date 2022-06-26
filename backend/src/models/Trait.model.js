// Inits Model for database
import { Sequelize, DataTypes, Model } from "sequelize";
import sequelize from "./sequalize.js";
class Trait extends Model {}

Trait.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    sequelize,
    modelName: "Trait",
    timestamps: false,
});

export default Trait;