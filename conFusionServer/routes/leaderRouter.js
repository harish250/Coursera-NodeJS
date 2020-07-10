const express = require("express"); //importing express to create Ruter
const bodyparser = require("body-parser"); //to parse the body of req and resp

const leaderRouter = express.Router(); //iniialize the router

leaderRouter.use(bodyparser.json()); //use body parser middleware

const Leaders = require("../models/leaders"); //importing the Leaders Model

var authenticate = require('../authenticate'); //for authentication of user using jwt or any other approach


//we are verifying user only when he does the following operations like post put delete beacause these may cause potential threat to the DB




leaderRouter
  .route("/")
  .get((req, res, next) => {
    Leaders.find({})
      .then(
        (leaders) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leaders);
        },
        (err) => {
          next(err);
        }
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser,(req, res, next) => { ///this is like saying u need to request only when you are verified or authenticated using verifyUser function 
    Leaders.create(req.body)
      .then(
        (leader) => {
          console.log("Leader Create", leader);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => {
          next(err);
        }
      )
      .catch((err) => {
        next(err);
      });
  })
  .put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.send("PUT operation not supported on /leaders");
  })
  .delete(authenticate.verifyUser,(req, res, next) => {
    Leaders.remove({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => {
          next(err);
        }
      )
      .catch((err) => next(err));
  });

leaderRouter
  .route("/:leaderId")
  .get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /leaders/" + req.params.leaderId);
  })
  .put(authenticate.verifyUser,(req, res, next) => {
    Leaders.findByIdAndUpdate(
      req.params.leaderId,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    )
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser,(req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = leaderRouter;
