const bodyparser = require("body-parser"); //body parserfor parsing the req and res of body
const express = require("express"); //for Router

const promoRouter = express.Router(); //initialize ROuter

promoRouter.use(bodyparser.json()); //user body parser middle ware
const Promotions = require("../models/promotions");    //Promotions module for DB Operations 
var authenticate = require('../authenticate');         //used to authenticate using jwt 



//we are verifying user only when he does the following operations like post put delete beacause these may cause potential threat to the DB




promoRouter
  .route("/")
  .get((req, res, next) => {
    Promotions.find({})
      .then(
        (promotions) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotions);
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  })
  .post(authenticate.verifyUser,(req, res, next) => {  //this is like saying u need to request only when you are verified or authenticated using verifyUser function 
    Promotions.create(req.body)
      .then(
        (promotion) => {
          console.log("Promotion Create ", promotion);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        },
        (err) => {
          next(err);
        }
      )
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.send("PUT operation not supported on /promotions");
  })
  .delete(authenticate.verifyUser,(req, res, next) => {
    Promotions.remove({})
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

promoRouter
  .route("/:promoId")
  .get((req, res, next) => {
    Promotions.findById(req.params.promoId)
      .then(
        (promotion) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /promotions/" + req.params.promoId
    );
  })
  .put(authenticate.verifyUser,(req, res, next) => {
    Promotions.findByIdAndUpdate(
      req.params.promoId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (promotion) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser,(req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
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

module.exports = promoRouter;
