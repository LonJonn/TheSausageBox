const movieRoute = require("./routes/movie");
const path = require("path");
const express = require("express");
const cors = require("cors");
const history = require("connect-history-api-fallback");
const app = express();

const exclude = function(path, middleware) {
  return function(req, res, next) {
    return req.path.startsWith(path) ? next() : middleware(req, res, next);
  };
};

app.use(cors());
// app.use(exclude("/api", history()));
app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));
// app.use(express.static(path.join(__dirname, "dist")));
app.use("/api", movieRoute);

app.listen(4000, () => {
  console.log("Running on port 4000...");
});
