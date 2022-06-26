//Connects to db
import { Sequelize, DataTypes } from "sequelize";
("postgresql://postgres@localhost:5432/ImagesDB");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
        ssl: process.env.DATABASE_URL.includes("localhost") ?
            false :
            {
                rejectUnauthorized: false,
            },
    },
    logging: false,
});

export default sequelize;