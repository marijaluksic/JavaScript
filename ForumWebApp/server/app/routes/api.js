const {ObjectId} = require("mongodb");
module.exports=function(app, express, db, jwt, secret){

  let ObjectId = require('mongodb').ObjectId;
  let apiRouter = express.Router();




  apiRouter.route('/users').get(function(req,res){


    db.collection('users').find({}).toArray(function(err, rows){

      if (!err){
        res.status(200).send(rows);
      }

      else
        res.status(500);

    });



  }).post(async function(req,res){

    require('bcryptjs').genSalt().then(salt => {
      require('bcryptjs').hash(req.body.password, salt).then(hash => {
        let user = {
          username : req.body.username,
          password : hash,
          name : req.body.name,
          email : req.body.email

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


    /*require('bcrypt-nodejs').hash(req.body.password, null, null, function(err, hash) {


      let user = {
        username : req.body.username,
        password : hash,
        name : req.body.name,
        email : req.body.email

      };


      db.collection('users').insertOne(user, function(err, data){

        console.log(data);

        if (!err){
          res.status(200).send(data.insertedId);
        }

        else
          res.status(500);

      });


    });*/




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

  apiRouter.use(function(req, res, next){

    var token = req.body.token || req.params.token || req.headers['x-access-token'] || req.body.query ||req.cookies['x-access-token'];

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

      return res.status(403).send({
        success:false,
        message:'No token'
      });

    }



  });


  apiRouter.route('/posts').get(async function(req,res){


    try {

      let rows = await db.collection('posts').find({}).toArray();
      res.status(200).send(rows);
    }
    catch(e) {
      res.status(500);
    }



  }).post(async function(req,res){


    console.log(req.body.post);

    let post = {
      userId : req.body.userId,
      timeStamp : req.body.timeStamp,
      comment : req.body.comment

    };

    try {
      let data = await db.collection('posts').insertOne(post).then(result => {
        //console.log(post._id);
        res.status(200);
        res.send(post._id);
      }).catch(function (err) {
        console.log("ERROR: ", err);
      });

    } catch (e) {
      res.status(500);
    }


  }).put(async  function(req,res){


    let post = {
      userId : req.body.userId,
      timeStamp : req.body.timeStamp,
      comment : req.body.comment

    };

    try {
      let data = await db.collection('posts').updateOne({
        _id : ObjectId(req.body._id)
      },{
        $set : post
      });

      res.status(200).send(data.nModified);

    } catch (e) {
      res.status(500);
    }




  });

  apiRouter.route('/posts/:id').delete(async function(req,res){

    try {

      let data = await db.collection('posts').deleteOne({
        _id:ObjectId(req.params.id)
      });

      res.status(200).send(data);

    } catch (e) {
      res.status(500);
    }


  });

  apiRouter.get('/me', function (req, res){

    res.send(req.decoded);

  });

  return apiRouter;

}
