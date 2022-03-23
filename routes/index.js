var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
const secretKey = "rubicamp";

module.exports = function (db) {
  const collection = db.collection("users");

  const response = {
    success: true,
    data: null,
  };

  router.post("/register", async function (req, res, next) {
    try {
      const { email, fullname, password } = req.body;

      const userExist = await collection.findOne({ email }); //check if user already exist by email
      if (userExist) throw "User already exist";

      const hash = await bcrypt.hashSync(password, saltRounds);
      const userCreated = await collection.insertOne({
        email,
        fullname,
        password: hash,
      });
      const user = await collection.findOne(userCreated.insertedId);
      var token = jwt.sign(user, secretKey);

      response.success = true;
      response.data = { token };
    } catch (err) {
      response.success = false;
      response.data = err;
    } finally {
      res.json(response);
    }
  });

  router.post("/login", async function (req, res, next) {
    try {
      const { email, password } = req.body;

      const userExist = await collection.findOne({ email }); //check if user already exist by email
      if (!userExist) throw "User doesn't exist";

      const match = await bcrypt.compare(password, userExist.password);
      if (!match) throw "Wrong password";

      var token = jwt.sign(userExist, secretKey);

      response.success = true;
      response.data = { token };
    } catch (err) {
      response.success = false;
      response.data = err;
    } finally {
      res.json(response);
    }
  });

  return router;
};
