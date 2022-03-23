var express = require("express");
var router = express.Router();
const ObjectId = require("mongodb").ObjectId;
const helpers = require("../helpers/util");

module.exports = function (db) {
  const collection = db.collection("todo");

  router.get("/", helpers.isAuthenticated, async function (req, res, next) {
    const todo = await collection.find({userid: req.user._id}).toArray();
    res.json({
      success: true,
      data: todo,
    });
  });

  router.get("/:id", async function (req, res, next) {
    const todo = await collection.findOne({
      _id: new ObjectId(req.params.id),
    });
    res.json(todo);
  });

  router.post("/",helpers.isAuthenticated, async function (req, res, next) {
    const dataCreated = await collection.insertOne({
      title: req.body.title,
      complete: false,
      userid:req.user._id
    });
    const todo = await collection.findOne(dataCreated.insertedId);
    res.json(todo);
  });

  router.put("/:id", async function (req, res, next) {
    const todo = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: {
          title: req.body.title,
          complete: JSON.parse(req.body.complete),
        },
      },
      {
        returnDocument: "after",
      }
    );
    res.json(todo.value);
  });

  router.delete("/:id", async function (req, res, next) {
    const todo = await collection.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    });
    res.json(todo.value);
  });

  return router;
};
