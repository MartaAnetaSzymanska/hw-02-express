const mongoose = require("mongoose");

const app = require("./app");

require("dotenv").config();

const urlDb = process.env.DB_HOST;

const connection = mongoose.connect(urlDb);

// connection
//   .then(() => {
//     console.log("DB connected");
//   })
//   .catch((err) => {
//     console.log(err);
//     process.exit(1); - kończy proces nieudanego połączenia
//   });

const startServer = async () => {
  try {
    await connection;
    console.log("DB connected");
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
startServer();
