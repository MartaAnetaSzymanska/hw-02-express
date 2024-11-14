const express = require("express");
const logger = require("morgan");
const cors = require("cors");

// instancja expressa
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

require("./config/config-passport");

const contactsRouter = require("./routes/api/contacts");
const usersRouter = require("./routes/api/users");

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

app.use((_, res) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: `Use api on routes: 
    /api/contacts - for all contacts
    /api/signup - registration user {username, email, password}
    /api/login - login {email, password}
    /api/list - get message if user is authenticated`,
    data: "Not found",
  });
});

app.use((err, _, res, __) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal Server Error",
  });
});

module.exports = app;
