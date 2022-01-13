const cors = require("cors");

const main = (app, mongodbURI) => {
  app.use(cors());
};

module.exports = main;
