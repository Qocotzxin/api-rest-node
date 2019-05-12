process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

const localDB = "mongodb://localhost:27017/coffe";
const productionDB = process.env.MONGO_URI;

let urlDB = process.env.NODE_ENV === "dev" ? localDB : productionDB;

process.env.URL_DB = urlDB;