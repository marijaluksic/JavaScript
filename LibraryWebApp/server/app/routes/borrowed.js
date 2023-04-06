const {ObjectId} = require("mongodb");
const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../../config");
module.exports=function(app, express, db, jwt, secret){

  let ObjectId = require('mongodb').ObjectId;
  let borrowedRouter = express.Router();

  borrowedRouter.use(function(req, res, next){

    const token = req.cookies['x-access-token'];

    if (token){
      jwt.verify(token, secret, function (err, decoded){
        if (err){
          return res.status(403).send({
            success:false,
            message:'Wrong token'
          });
        } else {
          req.decoded=decoded;
          next();
        }
      });
    } else {
      return res.status(401).send({
        success:false,
        message:'No token'
      });
    }
  });
  borrowedRouter.route('/').get(async function(req,res){
    try {
      let rows = await db.collection('borrowed').find({}).toArray();
      res.status(200).send(rows);
    }
    catch(e) {
      res.status(500);
    }
  });

  borrowedRouter.use(function(req, res, next){
    const token = req.cookies['x-access-token'];
    if (token){
      jwt.verify(token, secret, function (err, decoded){
        if (err){
          return res.status(403).send({
            success:false,
            message:'Wrong token'
          });
        } else {
          if(decoded.level>1)
          {
            req.decoded=decoded;
            next();
          }
          else
          {
            return res.status(403).send({
              success:false,
              message:'Wrong token'
            });
          }
        }
      });
    } else {
      return res.status(401).send({
        success:false,
        message:'No token'
      });
    }
  });

  borrowedRouter.route('/').post(async function(req,res){
    console.log(req.body.post);
    let borrowed = {
      userId : req.body.userId,
      bookId : req.body.bookId,
      timeStamp : req.body.timeStamp,
      returnDate : req.body.returnDate
    };
    try {
      let data = await db.collection('borrowed').insertOne(borrowed).then(result => {
        //console.log(post._id);
        res.json({status: 200, message: "Adding new loan successful!", insertedId: result.insertedId});
      }).catch(function (err) {
        console.log("ERROR: ", err);
      });
    } catch (e) {
      res.json({status: 500, message: "Adding new loan unsuccessful!"});
    }
  }).put(async  function(req,res){
    let borrowed = {
      userId : req.body.userId,
      bookId : req.body.bookId,
      timeStamp : req.body.timeStamp,
      returnDate : req.body.returnDate
    };
    try {
      let data = await db.collection('borrowed').updateOne({
        _id : ObjectId(req.body._id)
      },{
        $set : borrowed
      });
      res.status(200).send(data.nModified);
    } catch (e) {
      res.status(500);
    }
  });
  borrowedRouter.route('/:id').get(async function(req,res){
    try {
      let rows = await db.collection('borrowed').find({ userId: req.params.id } ).toArray();
      res.status(200).send(rows);
    }
    catch(e) {
      res.status(500);
    }
  }).delete(async function(req,res){
    try {
      let data = await db.collection('borrowed').deleteOne({
        _id:ObjectId(req.params.id)
      });
      res.status(200).send(data);
    } catch (e) {
      res.status(500);
    }
  });
  return borrowedRouter;
}
