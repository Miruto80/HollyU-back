import { Sequelize } from "sequelize";
import config from "../config/config.js";

const {dbHost,dbName,dbPass,dbPort,dbUser} = config

const sequelize = new Sequelize({
    database: dbName,
    username: dbUser,
    password: dbPass,
    host: dbHost,
    port: Number(dbPort),
    dialect: "postgres",
    logging: false,
    define: {
        timestamps: true,
        underscored: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
    pool: {
        max: 3,
        min: 1,
        idle: 10000,
    },
});

export default sequelize;