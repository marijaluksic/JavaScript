const {ObjectId} = require("mongodb");
const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../../config");
module.exports=function(app, express, db, jwt, secret){

  let ObjectId = require('mongodb').ObjectId;
  let usersRouter = express.Router();

  usersRouter.route('/').get(async function(req,res){
    db.collection('users').find({}).toArray(function(err, rows){
      if (!err){
        res.status(200).send(rows);
      }
      else
        res.status(500);
    });
  });
  usersRouter.use(function(req, res, next){
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

  usersRouter.route('/').post(async function(req,res){
    require('bcryptjs').genSalt().then(salt => {
      require('bcryptjs').hash(req.body.password, salt).then(hash => {
        let user = {
          name : req.body.name,
          password : hash,
          email : req.body.email,
          address : req.body.address,
          level: req.body.level
        };
        db.collection('users').insertOne(user, function(err, data){
          console.log(data);
          if (!err){
            res.status(200).send(data.insertedId);
          }
          else
            res.status(500);
        });
      });
    })
  });

  /*   apiRouter.route('/users/:id').delete(function(req,res){

         db.collection('users').removeOne({
             _id : ObjectId(req.params.id)
         }, function (err, data){

             if (!err){
                 res.json({ status: 'OK', affectedRows :data.nModified });
             }
             else
                 res.json({ status: 'NOT OK' });

         });


     });*/
  usersRouter.get('/me', function (req, res){

    res.send(req.decoded);

  });

  return usersRouter;

}
