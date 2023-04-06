const {ObjectId} = require("mongodb");
const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../../config");
module.exports=function(app, express, db, jwt, secret){

  let ObjectId = require('mongodb').ObjectId;
  let classificationRouter = express.Router();



  classificationRouter.use(function(req, res, next){

    // var token = req.body.token || req.params.token || req.headers['x-access-token'] || req.body.query ||req.cookies['x-access-token'];
    /*const authHeader = req.headers['authorization'];
    const token = (function() {
      if(authHeader && authHeader!== undefined)
      {
        //authHeader.split((' ')[1]);
        return authHeader.slice(8,authHeader.length-1);
      }
      else
      {
        return req.cookies['x-access-token'];
      }
    });*/

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
  //////////////////////////////////////////////////
  classificationRouter.route('/genres').get(async function(req,res){
    try {
      let rows = await db.collection('genres').find({}).toArray();
      res.status(200).send(rows);
    }
    catch(e) {
      res.status(500);
    }
  }).post(async function(req,res){

if(req.decoded.level>1)
{
  console.log(req.body.post);
  let genre = {
    name : req.body.name
  };
  try {
    let data = await db.collection('genres').insertOne(genre).then(result => {
      res.json({status: 200, message: "Adding new genre successful!", insertedId: result.insertedId});
    }).catch(function (err) {
      console.log("ERROR: ", err);
    });
  } catch (e) {
    res.json({status: 500, message: "Adding new genre unsuccessful!"});
  }
}
  else {
      return res.status(403).send({
        success:false,
        message:'Wrong token'
      });
    }
  }).put(async  function(req,res){
if(req.decoded.level>1){
  let genre = {
    name : req.body.name
  };
  try {
    let data = await db.collection('genres').updateOne({
      _id : ObjectId(req.body._id)
    },{
      $set : genre
    });
    res.status(200).send(data.nModified);
  } catch (e) {
    res.status(500);
  }
}
  else {
      return res.status(403).send({
        success:false,
        message:'Wrong token'
      });
    }
  });

  classificationRouter.route('/genres/:id').delete(async function(req,res){
    if(req.decoded.level>1)
    {
      try {
        let data = await db.collection('genres').deleteOne({
          _id:ObjectId(req.params.id)
        });
        res.status(200).send(data);
      } catch (e) {
        res.status(500);
      }
    }
  else {
      return res.status(403).send({
        success:false,
        message:'Wrong token'
      });
    }
  });

  ///////////////////////////////////////////////////////////

  classificationRouter.route('/publishers').get(async function(req,res){
    try {
      let rows = await db.collection('publishers').find({}).toArray();
      res.status(200).send(rows);
    }
    catch(e) {
      res.status(500);
    }
  }).post(async function(req,res){

if(req.decoded.level>1)
{
  console.log(req.body.post);
  let publisher = {
    name : req.body.name
  };
  try {
    let data = await db.collection('publishers').insertOne(publisher).then(result => {
      res.json({status: 200, message: "Adding new publisher successful!", insertedId: result.insertedId});
    }).catch(function (err) {
      console.log("ERROR: ", err);
    });
  } catch (e) {
    res.json({status: 500, message: "Adding new publisher unsuccessful!"});
  }
}
else {
  return res.status(403).send({
    success:false,
    message:'Wrong token'
  });
}
  }).put(async  function(req,res){
 if(req.decoded.level >1)
 {
   let publisher = {
     name : req.body.name
   };
   try {
     let data = await db.collection('publishers').updateOne({
       _id : ObjectId(req.body._id)
     },{
       $set : publisher
     });
     res.status(200).send(data.nModified);
   } catch (e) {
     res.status(500);
   }
 }
  else {
      return res.status(403).send({
        success:false,
        message:'Wrong token'
      });
    }
  });

  classificationRouter.route('/publishers/:id').delete(async function(req,res){

    if(req.decoded.level>1)
    {
      try {
      let data = await db.collection('publishers').deleteOne({
        _id:ObjectId(req.params.id)
      });
      res.status(200).send(data);
    } catch (e) {
      res.status(500);
    }
    }
    else {
      return res.status(403).send({
        success:false,
        message:'Wrong token'
      });
    }
  });
  return classificationRouter;
}
