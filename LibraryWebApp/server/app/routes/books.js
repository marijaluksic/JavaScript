const {ObjectId} = require("mongodb");
const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../../config");
module.exports=function(app, express, db, jwt, secret){

  let ObjectId = require('mongodb').ObjectId;
  let booksRouter = express.Router();

  booksRouter.use(function(req, res, next){

    const token = req.cookies['x-access-token'];
    console.log(token);

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

  booksRouter.route('/').get(async function(req,res){
    try {
      let rows = await db.collection('books').find({}).toArray();
      res.status(200).send(rows);
    }
    catch(e) {
      res.status(500);
    }
  });

  booksRouter.use(function(req, res, next){

    const token = req.cookies['x-access-token'];
    //console.log(token);
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
  booksRouter.route('/').post(async function(req,res){
    let book = {
      title : req.body.title,
      authorId : req.body.authorId,
      edition : req.body.edition,
      publisherId: req.body.publisherId,
      genreId: req.body.genreId
    };
    try {
      let data = await db.collection('books').insertOne(book).then(result => {

        res.json({status: 200, message: "Adding new book successful!", insertedId: book._id});
      }).catch(function (err) {
        console.log("ERROR: ", err);
      });
    } catch (e) {
      res.json({status: 500, message: "Adding new book unsuccessful!"});
    }
  }).put(async  function(req,res){
    let book = {
      title : req.body.title,
      authorId : req.body.authorId,
      edition : req.body.edition,
      publisherId: req.body.publisherId,
      genreId: req.body.genreId
    };
    try {
      let data = await db.collection('books').updateOne({
        _id : ObjectId(req.body._id)
      },{
        $set : book
      });

      res.status(200).send(data.nModified);

    } catch (e) {
      res.status(500);
    }
  });
  booksRouter.route('/:id').delete(async function(req,res){
    try {
      let data = await db.collection('books').deleteOne({
        _id:ObjectId(req.params.id)
      });
      res.status(200).send(data);
    } catch (e) {
      res.status(500);
    }
  });
  return booksRouter;
}
