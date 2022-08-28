import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import pg from "pg"; // see below for purpose
import env from "dotenv";
env.config();

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const environment = process.env.NODE_ENV || "development";

const jsonData = fs.readFileSync("src/config/config.json"); // read json file
const config = JSON.parse(jsonData)[environment]; // extract configuration from json file

console.log("loading sequelize and connecting to database...");
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  config["dialectModule"] = pg; // to prevent an error when using the serverless framework
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const loadModels = localLoader;

// localLoader is used for EC2 instances as well
async function localLoader() {
  const modelFiles = fs.readdirSync(__dirname).filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  });

  let count = 0;
  let models = {};
  modelFiles.forEach(async (file) => {
    try {
      let fetchedModule = await import(path.join(__dirname, file));
      const model = fetchedModule.default(sequelize, Sequelize.DataTypes);
      models[model.name] = model;
      ++count;
    } catch (err) {
      console.error(err);
    }

    if (count == modelFiles.length) associate(models);
  });
  return models;
}

// Call the associate() static method for models
const associate = (models) => {
  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });
  return models;
};

export let models = {};

export const modelsLoader = async () => {
  models = await loadModels();
};

export { models as default, sequelize };
