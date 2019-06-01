const localDB = "mongodb://localhost:27017/coffe"; // Local DB url for database
const productionDB = process.env.MONGO_URI; // Remote DB url set within Heroku

/**
 * Port number
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * Environment
 */
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

/**
 * Database url
 */
process.env.URL_DB = process.env.NODE_ENV === "dev" ? localDB : productionDB;

/**
 * Token expiration
 */
process.env.TOKEN_EXPIRATION = "30 days";

/**
 * Token seed (Set within Heroku)
 */
process.env.TOKEN_SEED = process.env.TOKEN_SEED || "pchowypbldepymipkmzzyjsc";

/**
 * Google Client ID
 */
process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "350417717602-6cikko54vkskju7q467d2djrj2711gqk.apps.googleusercontent.com";
