process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

const localDB = "mongodb://localhost:27017/coffe";
const productionDB =
  "mongodb+srv://cetchebarne:W6ItE4oyMPen8igE@api-rest-node-u4dlb.mongodb.net/test?retryWrites=true";

let urlDB = process.env.NODE_ENV === "dev" ? localDB : productionDB;

process.env.URL_DB = urlDB;